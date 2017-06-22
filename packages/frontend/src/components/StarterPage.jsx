import React from 'react';
import './starterPage.css';

export default function StarterPage() {
    return (
        <div>
            <p>Questa rotta in realtà non serve.. vai su:</p>
            <ul>
                <li>
                    <a href="/bubble">/bubble</a> per la bolla generica
                </li>
                <li>
                    <a href="/cook">/cook</a> per il cuoco
                </li>
                <li>
                    <a href="/client">/client</a> per il cliente
                </li>
                <li>
                    <a href="/admin">/admin</a>{" per l'amministratore"}
                </li>
                <li>
                    <a href="/notify">/notify</a> per giocare con le notifiche
                </li>
                <li>
                    <a href="/todo">/todo</a> per la todo list
                </li>
            </ul>
        </div>
    );
}

