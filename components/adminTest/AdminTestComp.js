import React from 'react';
import styles from './AdminTest.module.css'

function AdminTestComp(props) {

    return (
        <div className={`${styles['']} container mainContent`}>

            <nav>
                <ul>
                    <li><a href="#">Anasayfa</a></li>
                    <li><a href="#">Hakkımızda</a></li>
                    <li><a href="#">İletişim</a></li>
                </ul>
            </nav>
            <main>
                <section>
                    <h2>Hoşgeldiniz!</h2>
                    <p>Web sayfanızın içeriği burada olabilir.</p>
                </section>
            </main>
            <footer>
                <p>Telif Hakkı © 2024</p>
            </footer>
        </div>

    );
}

export default AdminTestComp;