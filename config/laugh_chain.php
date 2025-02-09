<?php

return [
    'district' => [
        'sec' => [
            'open' => 5,
            'running' => 15,
            'ran' => 5,
            'voting' => 14,
            'voted' => 5,
            'close' => 0,
        ],
        'progress' => [
            'open' => 0,
            'running' => 1,
            'ran' => 2,
            'voting' => 3,
            'voted' => 4,
            'close' => 5,
        ],
        'message' => [
            'open' => '立候補の受付を開始します。',
            'running' => '立候補が締め切られました。',
            'ran' => '投票を開始します。',
            'voting' => '投票が締め切られました。',
            'voted' => '次の立候補の開始を待っています。',
            'close' => '',
        ],
    ],

    'close_keyward' => 'もうええわ！',
    'close_sequesne' => [
        'どうも、ありがとうございました〜'
    ],

    'election_start_message' => '選挙が終了しました。',
    'election_close_message' => '選挙が終了しました。',

    'district_limit' => 10,

    'openAi' => [
        'model' => 'gpt-4',
        'prompt' => [
            'description'   =>      'ラフチェーンは、AIが漫才のネタを生成し、
                                    観客がストーリーの分岐点で、分岐の選択肢を投票によって決定し、
                                    みんなで一つの面白い漫才を作り上げるインタラクティブな体験型お笑いプラットフォームです。',
            'dataFormat'    =>      '出力はJSONで、回答はJSONのみにしてください。',

            'generate' => [
                'intro' =>  [
                                'role'  =>  'あなた（AI）は、「テーマ（theme）」に基づいた漫才ネタを生成し、ネタの一言目までを考える役割を担います。',
                                'keys'  =>  'キーは、2つで、「theme」と「opening_line」',
                ],
                
                'themes' =>  [
                                'role'      =>  'あなた（AI）は、ネタの「テーマ（theme）」を考える役割を担います',
                                'count'     =>  '個の「テーマ（theme）」を生成してください。',
                                'format'    =>  '「themes」をKeyとして、valueに配列を持ち、その配列の中に生成した「テーマ（theme）」を格納してください。
                                                フォーマットのサンプル：{"themes": [xxx,yyy,zzz,...]}
                                                それぞれ生成された「テーマ（theme）」がxxxやyyyとなるイメージです。',
                ],

                'opening_lines' =>  [
                                'role'      =>  'あなた（AI）は、「テーマ（theme）」に基づいた漫才ネタの「一言目(opening_line)」を考える役割を担います。',
                                'count'     =>  '個の「一言目(opening_line)」を生成してください。',
                                'context'   =>  '考慮して欲しい「テーマ（theme）」は、',
                                'format'    =>  '「opening_lines」をKeyとして、valueに配列を持ち、その配列の中に生成した「一言目(opening_line)」を格納してください。
                                                フォーマットのサンプル：{"opening_line": [xxx,yyy,zzz,...]}
                                                それぞれ生成された「一言目(opening_line)」がxxxやyyyとなるイメージです。',
                ],

                'scene' =>  [
                                'role'      =>  'あなた（AI）は、
                                                「テーマ（theme）」と「作成途中のネタ(history)」に基づいた漫才ネタの分岐点までのワン「シーン(scene)」を考える役割を担います。
                                                ボケの発言とツッコミの発言を1セットと考え、3セット生成してください。',
                                'count'     =>  '個の「シーン(scene)」を生成してください。',
                                'context'   =>  '考慮して欲しい「テーマ（theme）」と「作成途中のネタ(history)」は、',
                                'format'    =>  '「scene」をKeyとして、valueに配列を持ち、その配列の中に生成した「シーン(scene)」を格納してください。
                                                フォーマットのサンプル：{"scene": [xxx,yyy,zzz,...]}
                                                roleやcontentの記述は不要です。
                                                contentのvalueのみをxxxやyyyなどに格納するイメージです。',
                ],

                'choices' =>  [
                                'role'      =>  'あなた（AI）は、「テーマ（theme）」と「作成途中のネタ(history)」に基づいた漫才ネタの分岐点における「選択肢(choices)」を考える役割を担います。',
                                'count'     =>  '個の「選択肢(choices)」を生成してください。',
                                'context'   =>  '考慮して欲しい「テーマ（theme）」と「作成途中のネタ(history)」は、',
                                'format'    =>  '「choices」をKeyとして、valueに配列を持ち、その配列の中に生成した「選択肢(choices)」を格納してください。
                                                フォーマットのサンプル：{"choices": [xxx,yyy,zzz,...]}
                                                生成された「選択肢(choices)」がxxxやyyyとなるイメージです。',
                ],
            ],
        ],
    ],
];