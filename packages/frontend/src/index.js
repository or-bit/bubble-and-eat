import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    Route,
} from 'react-router-dom';

// importing css
import 'monolith-frontend/dist/css/main.css';
import 'bootstrap/dist/css/bootstrap.css';

import StarterPage from './StarterPage';
import ChefBubble from './bubbles/ChefBubble/ChefBubble';
import ClientBubble from './bubbles/ClientBubble/ClientBubble';
import AdminBubble from './bubbles/AdminBubble/AdminBubble';

const rootEl = document.getElementById('root');

function HomeRoute() {
    return <StarterPage />;
}

const render = () => {
    ReactDOM.render(
        <HashRouter basename="/">
            <div>
                <Route exact path="/" component={HomeRoute} />
                <Route path="/chef" component={ChefBubble} />
                <Route path="/client" component={ClientBubble} />
                <Route path="/admin" component={AdminBubble} />
            </div>
        </HashRouter>,
        rootEl,
    );
};

render();
