const fs = require('fs');
const path = require('path');

function firstCapitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);

}
function copyAndReplaceKeyword(src, dest, keyword, replaceValue, isRoute) {

    // Hedef dizini oluştur (eğer yoksa)
    if (!fs.existsSync(dest+'/'+replaceValue)) {
        fs.mkdirSync(dest+'/'+replaceValue, { recursive: true });
    }

    // Dosyayı oku
    fs.readFile(src, 'utf8', (err, data) => {
        if (err) {
            console.error('Dosya okuma hatası:', err);
            return;
        }

        // Dosya içindeki belirli değeri keyword ile değiştir
        const modifiedData = data.replace(new RegExp("KEYWORD_FIRST_CAPITALIZE", 'g'), firstCapitalize(replaceValue));
        let modifiedDataComplete = modifiedData.replace(new RegExp("KEYWORD", 'g'), replaceValue);

        // Dosya ismini keyword ile değiştirilmiş haline getir
        const fileName = path.basename(src);
        const newFileName = fileName.replace(keyword, isRoute ? replaceValue: firstCapitalize(replaceValue));
        const newFilePath = path.join(dest+'/'+replaceValue, newFileName);

        // Değiştirilmiş dosyayı yeni konumuna kopyala
        fs.writeFile(newFilePath, modifiedDataComplete, 'utf8', (err) => {
            if (err) {
                console.error('Dosya yazma hatası:', err);
                return;
            }

            //console.log('Dosya başarıyla kopyalandı ve içeriği değiştirildi:', newFilePath);
        });
    });
}

function copyComponent(){
    const destDirectory = 'components';
    let fileToCopy="KEYWORDComp.js"
    copyAndReplaceKeyword(path.join(srcDirectory, fileToCopy), destDirectory, keyword, replaceValue);

    let stylesFile = "KEYWORD.module.css"
    copyAndReplaceKeyword(path.join(srcDirectory, stylesFile), destDirectory, keyword, replaceValue);


}
function copyContainer(){
    const destDirectory = 'containers';
    let fileToCopy="KEYWORDCont.js"
    copyAndReplaceKeyword(path.join(srcDirectory, fileToCopy), destDirectory, keyword, replaceValue);


}
function copyRoute(){
    const destDirectory = 'app';
    let fileToCopy="page.jsx"
    copyAndReplaceKeyword(path.join(srcDirectory, fileToCopy), destDirectory, keyword, replaceValue);


}

// Kullanım örneği
const srcDirectory = 'sourceFolder';
const keyword = 'KEYWORD';
// const replaceValue = 'test2';

// Konsoldan alınan parametreleri kontrol et
const args = process.argv.slice(2); // İlk iki argümanlar node ve script dosyasının yolu olduğu için onları atlıyoruz

if (args.length < 2) {
    console.error('Lütfen en az bir dosya parametresi ve bir keyword belirtin.');
    process.exit(1);
}

const keywordIndex = args.indexOf('-n');
const replaceValue = keywordIndex !== -1 ? args[keywordIndex + 1] : 'default_name';


// Her bir dosya için kopyalama ve içerik değiştirme işlemini gerçekleştir
// const filesToCopy = ['file1.txt', 'file2.txt', 'file3.txt'];

args.forEach((param) => {
    if (param === '-c') {
        // copyAndReplaceKeyword(path.join(srcDirectory, filesToCopy[0]), destDirectory, keyword, replaceValue);
        copyComponent()
    } else if (param === '-t') {
        // copyAndReplaceKeyword(path.join(srcDirectory, filesToCopy[0]), destDirectory, keyword, replaceValue);
        // copyAndReplaceKeyword(path.join(srcDirectory, filesToCopy[1]), destDirectory, keyword, replaceValue);
        copyComponent()
        copyContainer()
    } else if (param === '-r') {
        // filesToCopy.forEach((file, index) => {
        //     copyAndReplaceKeyword(path.join(srcDirectory, file), destDirectory, keyword, replaceValue);
        // });
        copyComponent()
        copyContainer()
        copyRoute()
    } else {
        console.error('Geçersiz parametre:', param);
    }
});
