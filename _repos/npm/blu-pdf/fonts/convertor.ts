console.log('Hello')
const fs = require('fs')
const path = require('path')

/*
import path from 'path';
import fs from 'fs';
import {PDFDocument, PDFForm, StandardFonts, PDFFont} from 'pdf-lib';
*/


function toArrayBuffer(buffer){
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return view;
}

function base64encode(data){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

function base64decode(data){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}


//load font and embed it to pdf document
const fontBytesGothic = fs.readFileSync(path.join(__dirname, 'ipaexg.ttf'));
const fontBytesMincho = fs.readFileSync(path.join(__dirname, 'ipaexm.ttf'));

var text = "export const fonts = {";
text += "\tgothic: '" + base64encode(toArrayBuffer(fontBytesGothic)) + "',"
text += "\tmincho: '" + base64encode(toArrayBuffer(fontBytesMincho)) + "',"
text += '}'
fs.writeFile(path.join(__dirname,'font.js'), text, () => {});