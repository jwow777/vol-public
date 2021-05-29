import React from 'react'

import {
    Preloader
} from 'framework7-react';

export const Loader = () => (
    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
        <Preloader></Preloader>
    </div>
)