import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import { GenericBubble, WebNotification } from 'monolith-frontend';

import StarterPage from './components/StarterPage';
import CookBubble from './components/ChefBubble/ChefBubble';
import ClientBubble from './components/ClientBubble/ClientBubble';
import AdminBubble from './components/AdminBubble/AdminBubble';
import TodoBubble from './components/TodoBubble/TodoBubble';

const rootEl = document.getElementById('root');

function HomeRoute() {
    return <StarterPage />;
}

function notify() {
    return (
        <div>
            <button
              onClick={() => {
                  setTimeout(() => {
                      const notifica = new WebNotification('Notification title', 'notification body', 'http://pngimg.com/uploads/frog/frog_PNG3848.png');
                      notifica.notify();
                  }, 3000);
              }}
            >notify after 3 sec</button>
        </div>
    );
}

const render = () => {
    ReactDOM.render(
        <Router>
            <div>
                <Route exact path="/" component={HomeRoute} />
                <Route path="/bubble/" component={GenericBubble} />
                <Route path="/cook" component={CookBubble} />
                <Route path="/client" component={ClientBubble} />
                <Route path="/admin" component={AdminBubble} />
                <Route path="/todo/" component={TodoBubble} />
                <Route path="/notify" component={notify} />
            </div>
        </Router>,
        rootEl,
    );
};

render();
// store.subscribe(render);
