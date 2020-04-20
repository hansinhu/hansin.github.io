const cesfun = {
  getCardType (cardNo) {
    let rule = {};
    let cardType = ''
    rule['visa'] = new RegExp('^4\\d{15}$');
    rule['mastercard'] = new RegExp('^(5[1-5][\\d]{2}|222[1-9]|22[3-9][\\d]|2[3-6][\\d]{2}|27[0-1][\\d]|2720)\\d{12}$');
    rule['jcb'] = new RegExp('^35(28|29|([3-8][\\d]))\\d{12}$');
    rule['maestro'] = new RegExp('^(50|(5[6-9])|(6[\\d]))\\d{10,17}$');
    rule['ae'] = new RegExp('^3[47]\\d{13}$');
    rule['aura'] = new RegExp('^5\\d{18}$');
    rule['diners'] = new RegExp('^36\\d{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}$');
    rule['discover'] = new RegExp('^6(?:011|5\\d{2})\\d{12}$');
    rule['hipercard'] = new RegExp('^(?:606282|637095|637568)\\d{10}|38\\d{14,17}$');
    rule['elo'] = new RegExp('^(?:50670[7-8]|506715|50671[7-9]|50672[0-1]|50672[4-9]|50673[0-3]|506739|50674[0-8]|50675[0-3]|50677[4-8]|50900[0-9]|50901[3-9]|50902[0-9]|50903[1-9]|50904[0-9]|50905[0-9]|50906[0-4]|50906[6-9]|50907[0-2]|50907[4-5]|636368|636297|504175|438935|40117[8-9]|45763[1-2]|457393|431274|50907[6-9]|50908[0-9]|627780)[0-9]*$');
    /* 新支付新增 */
    rule['rupay'] = new RegExp('^(508[5-9][0-9]{12})|(6069[8-9][0-9]{11})|(607[0-8][0-9]{12})|(6079[0-8][0-9]{11})|(608[0-5][0-9]{12})|(6521[5-9][0-9]{11})|(652[2-9][0-9]{12})|(6530[0-9]{12})|(6531[0-4][0-9]{11})$');
    /* 墨西哥当地卡种 */
    rule['carnet'] = new RegExp('^(286900|502275|506(199|2(0[1-6]|1[2-578]|2[289]|3[67]|4[579]|5[01345789]|6[12359]|7[02-9]|8[0-47]|9[479])|3(0[0-79]|1[1-49]|2[039]|3[02-79]|4[0-49]|5[0-79]|6[014-79]|7[0-49]|8[023467]|9[124])|402)|606333|636379|639(388|484|559)|588772(02|66|67|68|74|84)|6046220[34])$');
    for (let key in rule) {
      if (rule[key].test(cardNo)) {
        cardType = key
      }
    }
    return cardType
  },
  // luhn算法
  luhnCheck (bankno) {
    const lastNum = bankno.substr(bankno.length - 1, 1);// 取出最后一位（与luhn进行比较）

    const first15Num = bankno.substr(0, bankno.length - 1);// 前15或18位
    let newArr = [];
    for (let i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
    let arrJiShu = []; // 奇数位*2的积 <9
    let arrJiShu2 = []; // 奇数位*2的积 >9

    let arrOuShu = []; // 偶数位数组
    for (let j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 === 1) { // 奇数位
        if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2); } else { arrJiShu2.push(parseInt(newArr[j]) * 2); }
      } else { arrOuShu.push(newArr[j]); }
    }

    let jishu_child1 = [];// 奇数位*2 >9 的分割之后的数组个位数
    let jishu_child2 = [];// 奇数位*2 >9 的分割之后的数组十位数
    for (let h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    let sumJiShu = 0; // 奇数位*2 < 9 的数组之和
    let sumOuShu = 0; // 偶数位数组之和
    let sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
    let sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
    let sumTotal = 0;
    for (let m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (let n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (let p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    // 计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    // 计算luhn值
    let k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10;
    let luhn = 10 - k;

    if (parseInt(lastNum) === parseInt(luhn)) {
      return true;
    } else {
      return false;
    }
  },

  getCardLuhnPass (cardNo) {
    return (cardNo && this.luhnCheck(cardNo)) || false
  },
  getSecurCodePass (securCode, cardType) {
    const cvv = new RegExp('^\\d{3}$')
    const cvv2 = new RegExp('^\\d{4}$')
    if (cardType === 'ae') {
      return cvv2.test(securCode)
    } else {
      return cvv.test(securCode)
    }
  },
  /**
*
*
* @param {*} expireDate 格式规定： mm/yyyy
* @returns
*/
  getExpireDatePass (expireDate) {
    if (expireDate) {
      const month = expireDate.split('/')[0]
      const year = expireDate.split('/')[1]

      const NowDate = new Date();
      const nowyear = NowDate.getFullYear()
      let nowmonth = NowDate.getMonth() + 1
      nowmonth = `${nowmonth}`.padStart(2, '0')
      const today = `${nowyear}${nowmonth}`
      const selectDay = `${year}${month}`
      return selectDay >= today
    }
    return false
  },
}

export default cesfun
