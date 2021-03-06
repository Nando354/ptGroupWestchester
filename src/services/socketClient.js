import openSocket from 'socket.io-client';


// Connect to back-end server
const url = {
  hostname: 'localhost',
  // hostname: '10.38.123.225',
  // hostname: 'ec2-52-24-28-205.us-west-2.compute.amazonaws.com';
  port: 3001,
};

const socket = openSocket(`http://${url.hostname}:${url.port}`);

/**
 * Subscribe to timer events
 * (Do this in case we run into a race condition where timer events 
 * are being emitted from the server, but the client hasn’t shown it’s
 * interest in it yet, causing events to go missing)
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToTimer(cb) {
  console.log('REQUEST: get time from server');
  // subscribe to timer event
  socket.on('timer', timestamp => cb(null, timestamp));

  // emit this event every 1 second
  socket.emit('subscribeToTimer', 1000);
}

/**
 * Subscribe to chat events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToChat(cb) {
  console.log('REQUEST: subscribe to chat');
  // subscribe to chat event
  socket.on('send', message => cb(null, message));

  // emit this event every 1s
  socket.emit('subscribeToTimer', 1000);
}

/**
 * Subscribe to users events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToUsers(cb) {
  console.log('REQUEST: subscribe to chat');
  // subscribe to chat event
  socket.on('joined', message => cb(null, message));

  // emit this event every 1s
  socket.emit('get_users');
}

function loginRequest(name, password = '') {
  console.log(`LOGIN: ${name} wants to login`);
  socket.emit('login', { name, password });
}

/**
 * Subscribe to chat history events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function getChatHistory(cb) {
  console.log('REQUEST: get chat history');
  
  // subscribe to chat event
  socket.on('message_history', messages => cb(null, messages));
  
  // emit this event every 1s
  socket.emit('get_messages');
}

function emitMessage(name, content, date) {
  console.log('REQUEST: send chat msg');  
  socket.emit('message', {
    name,
    content,
    date,
  });
}

function getQuote(cb) {
  console.log('REQUEST: subscribe to quote');
  // subscribe to quote event
  socket.on('random_quote', quote => cb(null, quote));

  // emit this event
  socket.emit('get_quote');
}


export {
  subscribeToTimer,
  subscribeToChat,
  subscribeToUsers,
  loginRequest,
  getChatHistory,
  emitMessage,
  getQuote,
};
