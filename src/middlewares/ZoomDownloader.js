/* 
    TODO:
    - Acessar o campo de senha e preenchê-lo com o token do Zoom
    - Criar um método que irá fazer o download dos arquivos
    - Conseguir que a ação de download seja realizada apenas quando o usuário clicar no botão de download
    - Evitar o retorno 401 do Zoom
*/

import { Builder, By, Capabilities } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';

export default class ZoomDownloader {
    constructor() {
        // URL e Password para acesso ao Zoom
        this.Access_Info = this.Access_Info.bind(this);
    }
    async Access_Info(URL, PassWord) {
        const browser = await new Builder()
            .withCapabilities(Capabilities.chrome(chromedriver.path))
            // .setChromeOptions(new Options().addArguments(['--headless', '--no-sandbox', '--disable-dev-shm-usage']))
            .build();
        try {
            await browser.get(URL);
            await browser.findElement(By.name('password')).sendKeys(PassWord.trim());
            console.log(`Password : ${PassWord}\nURL : ${URL}`);
            await browser.findElement(By.className('submit')).click();

            await browser.sleep(10000);
        }
        finally {
            await browser.quit();
        }
    }
}