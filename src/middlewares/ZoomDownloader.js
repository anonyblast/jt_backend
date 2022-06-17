import { Builder, By, Capabilities } from 'selenium-webdriver';
// import { Options } from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';

export default class ZoomDownloader {
    constructor() {
        // URL e Password para acesso ao Zoom
        this.Access_Info = this.Access_Info.bind(this);
    }
    // Método que retorna um objeto com os dados do usuário
    async Access_Info(URL, PassWord) {
        // Criar um objeto que será retornado
        const browser = await new Builder()
            .withCapabilities(Capabilities.chrome(chromedriver.path))
            // .setChromeOptions(new Options().addArguments('--headless'))
            .build();
        try {
            await browser.get(URL);
            await browser.findElement(By.name('password')).sendKeys(PassWord.trim());
            console.log(URL);
            console.log(PassWord);
            // Elemento que deve ser clicado : submit
            await browser.findElement(By.className('submit')).click();
            await browser.quit();
        }
        catch (error) {
            console.log(error);
        }
    }
}