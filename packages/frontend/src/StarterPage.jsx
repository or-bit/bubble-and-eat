import React from 'react';
import './starterPage.css';

export default function StarterPage() {
    return (
        <div>
            <p>Questa rotta in realtà non serve.. vai su:</p>
            <ul>
                <li>
                    <a href="/chef">/chef</a> per il cuoco
                </li>
                <li>
                    <a href="/client">/client</a> per il cliente
                </li>
                <li>
                    <a href="/admin">/admin</a>{" per l'amministratore"}
                </li>
            </ul>
        </div>
    );
}

