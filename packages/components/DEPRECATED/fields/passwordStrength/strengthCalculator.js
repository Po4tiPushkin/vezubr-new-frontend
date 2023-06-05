import t from '@vezubr/common/localization';

const m_strUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const m_strLowerCase = 'abcdefghijklmnopqrstuvwxyz';
const m_strNumber = '0123456789';
const m_strCharacters = '!@#$%^&*?_~';
const strengthTexts = {
  0: 0,
  20: t.reg('pwdWeak'),
  40: t.reg('pwdStrong'),
  60: t.reg('pwdStrong'),
  70: t.reg('pwdSuperStrong'),
};

class StrengthCalculator {
  static text(score) {
    if (score >= 1 && score < 40) {
      return strengthTexts[20];
    } else if (score >= 40 && score < 60) {
      return strengthTexts[40];
    } else if (score >= 60 && score < 70) {
      return strengthTexts[60];
    } else if (score >= 70) {
      return strengthTexts[70];
    } else {
      return strengthTexts[0];
    }
  }

  static score(strPassword) {
    // Reset combination count
    let nScore = 0;

    // Password length
    // -- Less than 4 characters
    if (strPassword.length < 5) {
      nScore += 5;
    }
    // -- 5 to 7 characters
    else if (strPassword.length > 4 && strPassword.length < 8) {
      nScore += 10;
    }
    // -- 8 or more
    else if (strPassword.length > 7) {
      nScore += 25;
    }

    // Letters
    let nUpperCount = StrengthCalculator.countContain(strPassword, m_strUpperCase);
    let nLowerCount = StrengthCalculator.countContain(strPassword, m_strLowerCase);
    let nLowerUpperCount = nUpperCount + nLowerCount;
    // -- Letters are all lower case
    if (nUpperCount === 0 && nLowerCount !== 0) {
      nScore += 10;
    }
    // -- Letters are upper case and lower case
    else if (nUpperCount !== 0 && nLowerCount !== 0) {
      nScore += 20;
    }

    // Numbers
    let nNumberCount = StrengthCalculator.countContain(strPassword, m_strNumber);
    // -- 1 number
    if (nNumberCount === 1) {
      nScore += 10;
    }
    // -- 3 or more numbers
    if (nNumberCount >= 3) {
      nScore += 20;
    }

    // Characters
    let nCharacterCount = StrengthCalculator.countContain(strPassword, m_strCharacters);
    // -- 1 character
    if (nCharacterCount === 1) {
      nScore += 10;
    }
    // -- More than 1 character
    if (nCharacterCount > 1) {
      nScore += 25;
    }

    // Bonus
    // -- Letters and numbers
    if (nNumberCount !== 0 && nLowerUpperCount !== 0) {
      nScore += 2;
    }
    // -- Letters, numbers, and characters
    if (nNumberCount !== 0 && nLowerUpperCount !== 0 && nCharacterCount !== 0) {
      nScore += 3;
    }
    // -- Mixed case letters, numbers, and characters
    if (nNumberCount !== 0 && nUpperCount !== 0 && nLowerCount !== 0 && nCharacterCount !== 0) {
      nScore += 5;
    }

    return nScore;
  }

  static countContain(strPassword, strCheck) {
    // Declare variables
    let nCount = 0;

    for (let i = 0; i < strPassword.length; i++) {
      if (strCheck.indexOf(strPassword.charAt(i)) > -1) {
        nCount++;
      }
    }

    return nCount;
  }
}

export default StrengthCalculator;
