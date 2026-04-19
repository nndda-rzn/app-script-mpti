/**
 * SISTEM MANAJEMEN LAUNDRY - SERVER SIDE
 * Termasuk Modul Marketing & Promo Code terintegrasi penuh.
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('L-Premium System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) { 
  return HtmlService.createHtmlOutputFromFile(filename).getContent(); 
}
