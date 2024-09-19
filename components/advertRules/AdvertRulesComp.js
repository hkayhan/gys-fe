import React from 'react';
import styles from './AdvertRules.module.css'

function AdvertRulesComp(props) {

    return (
        <div className={`${styles['']} container  shadow bg-white mt-3 p-3`}>

                <h1 className={"text-center"}>İlan Oluşturma Kuralları</h1>
                <ol>
                    <li>İlan başlığı ve ilan açıklaması alanlarında yalnızca ilgili ilanın kapsamı dahilinde bilgiler
                        yer almalıdır. Söz konusu alanlara reklam içerikli yazı veya görsel ile herhangi bir link vs.
                        eklenemez.
                    </li>
                    <li>Yayınlanmak istenen ilanlarda kullanılan tüm görsel ve videolar doğrudan ilan konusu ile ilgili
                        olmalıdır.
                    </li>
                    <li>İlan veren üye doğru bilgiler paylaşmak ile yükümlüdür. İlanda yer alan bilgilerin hatalı veya
                        yanlış olması durumlarında tüm yasal sorumluluk ilan sahibine aittir.
                    </li>
                    <li>Kullanıcılar Eskisehir.net üzerinden vereceği ilanlarda; birden fazla ilana yönelik içerik ve
                        başlık girişi yapamaz. Paylaşılan tüm ilanlar yalnızca tek bir kategori ve konu üzerine olmak
                        zorundadır. Aksi durumlarda ilanınız yayın onayı alamaz.
                    </li>
                    <li>Özel İlan ödemeleri banka hesabına havale/eft veya kredi kartı ile yapıldıktan ve ilan
                        koşullarına uygunluğu denetlendikten sonra yayınlanır.
                    </li>
                    <li>Özel ilanlar yayınlandıktan sonra ilan veren üye tarafından özel ilan süresi dolmadan silinmesi
                        veya ilan içerisinde yapılacak herhangi bir değişikliğe bağlı olarak ilan kurallarının ihlal
                        edilmesi durumlarında ücret iadesi yapılmaz.
                    </li>
                    <li>Özel ilanlar dışındaki hiçbir ilan görselinde farklı internet sitelerinin link ya da isimleri
                        yer alamaz.
                    </li>
                    <li>Sistem içerisindeki bir başka kullanıcıya ait ilan ilan görselleri veya kişisel bilgiler
                        kullanılamaz.
                    </li>
                    <li>Özel ilanlarda tanımlanan süre yalnızca ilgili ilan için geçerlidir. Söz konusu süre
                        dondurulamaz veya başka bir ilana ya da üyeye devredilemez.
                    </li>
                    <li>Aynı ilan birden fazla kez girilemez. Bir kez girilen ilan yayın süresi dolmadan silinir ve
                        tekrar aynısı girilirse; üyeye ait tüm ilanlar sıralamada en sonda gösterilir. Gerekli görüldüğü
                        takdirde üyenin tüm ilanları eskisehir.net tarafından silinebilir veya üyeliği geçici ya da
                        kalıcı olarak iptal edilebilir.
                    </li>
                    <li>İlan içeriğinde düzgün Türkçe kullanılarak açıklayıcı bilgiler paylaşılmalıdır. Ayrıca hakaret
                        küfür aşağılayıcı ya da küçük düşürücü ifadeler ve benzerlerinin yer aldığı veya toplumsal
                        ahlaki kurallara aykırı hiçbir ilan yayınlanmaz.
                    </li>
                    <li>İlan Veren” alanında üyeye ait telefon ve e-posta bilgileri gösterildiğinden “İlan Açıklama”
                        kısmında bu bilgilerin paylaşılmasına gerek yoktur. Kurumlar tarafından verilen ilanlarda ilgili
                        kurumun iletişim bilgileri “İlan Açıklama” alanında paylaşılabilir fakat internet sayfasına
                        ilişkin bilgiler –özel ilan değilse – verilemez.
                    </li>
                    <li>Verilen ilanlar 30 gün süre ile yayında kalır. Bu sürenin sonunda sistem tarafından otomatik
                        olarak silinir.
                    </li>
                    <li>Kullanıcıların Eskisehir.net İş İlanları kategorisinde 30 gün içerisinde bir adet ücretsiz ilan
                        paylaşma hakkı vardır. Üyenin ilk ilanını oluşturduğu andan itibaren 30 gün içerisinde vereceği
                        diğer iş ilanları yayın onayı beklenmeksizin ücrete tabi tutulur.
                    </li>
                    <li>Emlak ve Vasıta kategorilerinde yer alacak tüm ilanlar mal sahibi tarafından veya mal sahibinin
                        onayı alınarak girilmelidir.
                    </li>
                    <li>Alışveriş kategorisinde yer alacak ilana konu olan tüm araç ürün eşya vs. girişleri mutlaka mal
                        sahibinin onayı alınarak yapılmalıdır.
                    </li>
                    <li>Satılan ya da kiralanan hiçbir ürün eşya araç konut vb. için temsili fiyat verilmemesi
                        gerekmektedir.
                    </li>
                    <li>İlan aktifliğini yitirdiği an üye tarafından sistemden kaldırılmalıdır. Satışı yapılan veya
                        kiralanan ürün eşya araç konut vb. ilanlarının kaldırılması tamamen üye sorumluluğundadır.
                    </li>
                </ol>
                <p className={styles["note"]}><strong className={styles["note-strong"]}>Önemli Not:</strong><br/>İlan Verme Kurallarına aykırı özel ilanlar silinir
                    ve ücret iadesi yapılmaz.<br/>İlan Verme Kuralları hem bireysel hem kurumsal üyelerimiz için
                    geçerlidir.<br/>İlan girişinde bulunan üye yukarıda belirtilen kuralları okuyup anladığını ve bu
                    kurallara uyacağını kabul ve taahhüt etmiş bulunur.</p>
        </div>

    );
}

export default AdvertRulesComp;