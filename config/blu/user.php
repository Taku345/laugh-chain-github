<?php


return [

    'config' => [
        'id' => [
            'type' => false,
            'search' => [
                'id' => [
                    'type' => 'text',
                ],
                'id_not_in' => [
                    'type' => 'text',
                    'compare' => 'not in',
                ],
            ],
            'sort' => true,
        ],

        'name' => [
            'label' => 'Name',
            'type' => 'text',
            'size'=> 60,
            'search' => [
                'name' => [
                    'label' => 'Name',
                    'type' => 'text',
                    'compare' => 'like',
                    'placeholder' => 'あいまい検索',
                ],
            ],
            'sort' => true,
        ],
        'email' => [
            'label' => 'Mail Address',
            'type' => 'text',
            'size'=> 60,
            'search' => [
                'name' => [
                    'label' => 'Mail Address',
                    'type' => 'text',
                    'compare' => 'like',
                    'placeholder' => 'あいまい検索',
                ],
            ],
            'sort' => true,
        ],
        'public_key' => [
            'label' => 'Public Key',
            'type' => 'raw',
            'size'=> 60,
            'search' => [
                'name' => [
                    'label' => 'Public Key',
                    'type' => 'text',
                    'compare' => 'like',
                    'placeholder' => 'あいまい検索',
                ],
            ],
            'sort' => true,
            'required' => true,
        ],
        'address' => [
            'label' => 'Address',
            'type' => 'raw',
            'size'=> 60,
            'search' => [
                'name' => [
                    'label' => 'Address',
                    'type' => 'text',
                    'compare' => 'like',
                    'placeholder' => 'あいまい検索',
                ],
            ],
            'sort' => true,
            'required' => true,
        ],
    ],


    'index' => [
        '_control',
        'name',
        'email',
        'public_key',
        'address',
    ],

    'search' => [
        'name',
        'email',
        'public_key',
        'address',
    ],

    'form' => [
        'name',
        'email',
        'public_key',
        'address',
    ],
];