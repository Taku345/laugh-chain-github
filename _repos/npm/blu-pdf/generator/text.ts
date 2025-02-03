class TextClass
{

    
	/*
	 * font: PDFFont
	 */
	static linesText(text, w, s, font)
	{
		let lines = [];
		text.split(/\r|\n|\r\n/g).map((line_text) => {
			let line_tmp = '';
			let textWidthTmp = 0;
			TextClass.separateText(line_text).map((word) =>
			{
				// TODO もしいけそうなら font がなくても計測
				// 英語の単語区切り
				const textWidth = font.widthOfTextAtSize(line_tmp + word, s);
				if (textWidth > w)
				{
					lines.push({
						text:line_tmp,
						w: textWidthTmp,
					});
					if (word[0] == ' ') word = word.slice(1, word.length); // 次の行頭にスペースを入れない
					line_tmp = word; // ここで強制的に足されるため、1単語で w を超えるものもレンダーされる
					textWidthTmp = textWidth;
				}
				else
				{
					line_tmp += word;
					textWidthTmp = textWidth;
				}
			});

			if (line_tmp) lines.push({
				text:line_tmp,
				w: font.widthOfTextAtSize(line_tmp, s),
			});
		});

		return lines;
	}

	/**
	 * 改行など(\r\n\t)は加味しない(別の場所で処理)
	 * 半角英数は単語ごと、全角を一文字ごとにして返す
	 * 行頭禁則文字 => 前の文字とつなげる
	 * 行末禁則文字 => 次の文字とつなげる
	 */
	static separateText(text)
	{
		let results = [];
		let word = '';
		for (let i = 0; i < text.length; i++)
		{
			if (text[i].match(/[ -~]/)) // 半角
			{
				if (text[i] == ' ' && word)
				{
					results.push(word);
					word = ' ';
				}
				else
				{
					word += text[i];
				}
			}
			else
			{
				if (text[i].match(/[、。，．・！？」』）］〉》〕】ヽゝ々ー・ぁぃぅぇぉっゃゅょァィゥェォッャュョ]/)) // 行頭禁則文字
				{
					// 前の文字とつなげる
					if (results.length < 1) // 最初に置かれているなら仕方ない(わざと)のでそのまま足す
					{
						results.push(text[i]);
					}
					else
					{
						results[results.length - 1] += text[i];
					}
				}
				else if (text[i].match(/[「『（［〈《〔【 ]/)) // 行末禁則文字
				{
					//次のもじのためにプール
					word += text[i];
				}
				else
				{
					results.push(word + text[i]);
					word = '';
				}
			}
		}

		if (word) results.push(word);
		
		return results;
	}


}

export default TextClass