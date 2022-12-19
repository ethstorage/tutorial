
function checkLabel(label) {
    const re = /^(?!-)(^[0-9a-z-]+$)/;
    return re.test(label) && !label.endsWith("-");
}

function validateSearchName(name, suffix) {
    if (name && name.length > 0) {
      const nameArray = name.split('.');
      const hasEmptyLabels = nameArray.some(label => label.length === 0);
      if (hasEmptyLabels) {
        return 'invalid';
      }
      if (nameArray.length === 1 && checkLabel(nameArray[0])) {
        return '';
      } else if (nameArray.length === 2 && nameArray[1] === suffix && checkLabel(nameArray[0])) {
        return '';
      }
      return 'invalid';
    }
    return "";
}

function parseSearchTerm(term, suffix) {
    let regex = /[^.]+$/

    if (term.indexOf('.') !== -1) {
        const termArray = term.split('.');
        const tld = term.match(regex) ? term.match(regex)[0] : ''
        if (tld === suffix && [...termArray[termArray.length - 2]].length < 3) { // code-point length
            return 'short';
        }
        return 'supported';
    }
    return 'unsupported';
}

export function parseTerm(term, suffix) {
    if (validateSearchName(term, suffix) === 'invalid') {
      return 'invalid';
    }
    return parseSearchTerm(term, suffix);
}
