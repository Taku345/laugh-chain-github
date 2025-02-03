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
        'status' => [
            'type' => false,
            'label' => 'Status',
            'search' => [],
            'attribute' => 'status'

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
            'required' => true,
        ],
        'is_public' => [
            'label' => 'Public',
            'type' => 'radio',
            'options' => [
                0 => 'Private',
                1 => 'Public',
            ],
            'default' => 0,
            'search' => [
                'is_public'=> [
                    'label' => 'Public',
                    'type' => 'select',
                    'options' => [
                        '' => '',
                        0 => 'Private',
                        1 => 'Public',
                    ],
                ],
            ]
        ],
        'scheduled_at' => [
            'label' => 'Scheduled',
            'type' => 'datetime-local',
            'search' => [
                /*
                'is_public'=> [
                    'label' => 'Public',
                    'type' => 'radio',
                    'options' => [
                        0 => 'Private',
                        1 => 'Public',
                    ],
                ],
                */
            ]
        ],
        'district_limit' => [
            'label' => 'District Limit',
            'type' => 'number',
            'default' => 0,
            'placeholder' => 'Infinite'
        ],

    ],


    'index' => [
        '_control_crud',
        '_control',
        'is_public',
        'status',
        'name',
        'scheduled_at',
        'district_limit',
    ],

    'search' => [
        ['name', 'is_public'],
        'scheduled_at',
    ],

    'form' => [
        'is_public',
        'name',
        'scheduled_at',
        'district_limit',
    ],
];