/***** ATLETAS · Backend de sincronización (Google Apps Script) *****
 * Un Google Sheet guarda un documento por atleta:
 *   columna A = id del atleta   |   B = JSON con todos sus datos   |   C = última actualización
 *
 * INSTALACIÓN
 * 1. Crea un Google Sheet nuevo (vacío). Anótalo como "base de datos".
 * 2. Extensiones → Apps Script. Borra lo que haya y pega TODO este archivo.
 * 3. Guarda. Implementar → Nueva implementación → Tipo: "Aplicación web".
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier usuario
 *    Implementar → autoriza los permisos.
 * 4. Copia la URL que termina en /exec.
 * 5. Pégala en atleta.html (constante SCRIPT_URL, arriba del todo) y sube el archivo al repo.
 *    (También puedes pegarla en cada documento: Gestión → Conexiones → Apps Script URL.)
 *
 * Al volver a implementar cambios, usa "Gestionar implementaciones" → editar (lápiz)
 * → Versión: Nueva, para conservar la MISMA URL.
 ********************************************************************/

var SHEET_NAME = 'DOCS';

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'json', 'actualizado']);
  }
  return sh;
}

// ---- LECTURA: atleta.html la llama por JSONP (?id=xxx&callback=yyy) ----
function doGet(e) {
  var cb = e && e.parameter ? e.parameter.callback : null;
  var id = e && e.parameter ? e.parameter.id : null;
  var out = null;
  try {
    var sh = getSheet_();
    var data = sh.getDataRange().getValues();
    if (id && id !== 'all') {
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(id)) {
          out = data[i][1] ? JSON.parse(data[i][1]) : null;
          break;
        }
      }
    } else {
      out = {};
      for (var j = 1; j < data.length; j++) {
        if (data[j][0]) out[data[j][0]] = data[j][1] ? JSON.parse(data[j][1]) : null;
      }
    }
  } catch (err) {
    return reply_({ ok: false, error: String(err) }, cb);
  }
  return reply_({ ok: true, data: out }, cb);
}

// ---- ESCRITURA: atleta.html envía {doc, data} por POST ----
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var id = payload.doc;
    if (!id) throw new Error('falta "doc"');
    var json = JSON.stringify(payload.data || {});
    var sh = getSheet_();
    var data = sh.getDataRange().getValues();
    var row = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) { row = i + 1; break; }
    }
    var now = new Date();
    if (row > 0) {
      sh.getRange(row, 2).setValue(json);
      sh.getRange(row, 3).setValue(now);
    } else {
      sh.appendRow([id, json, now]);
    }
    return reply_({ ok: true }, null);
  } catch (err) {
    return reply_({ ok: false, error: String(err) }, null);
  }
}

function reply_(obj, cb) {
  var body = JSON.stringify(obj);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + body + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}
