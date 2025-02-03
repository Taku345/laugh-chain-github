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
];