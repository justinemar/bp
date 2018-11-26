const socketio = require('socket.io');
const helper = require('./index');

module.exports.listen = (app) => {
    const io = socketio.listen(app);
    io.on('connection', (socket) => {
        // Broadcast user status
        socket.on('authed', (user) => {
            helper.broadCast('auth', user, (err, data) => {
                const updateUser = {
                    identity: {
                        _id: data._id,
                        display_name: data.display_name,
                        photo_url: data.photo_url,
                        online: data.online,
                    },
                };
                if (err) {
                    console.log('error handler');
                }

                if (data) {
                    io.emit('userConnected', updateUser);
                }
            });
        });

        socket.on('deauthed', (user) => {
            helper.broadCast('deauth', user, (err, data) => {
                const updateUser = {
                    identity: {
                        _id: data._id,
                        display_name: data.display_name,
                        photo_url: data.photo_url,
                        online: data.online,
                    },
                };
                if (err) {
                    console.log('error handler');
                }

                if (data) {
                    io.emit('userDisconnected', updateUser);
                }
            });
        });


        // GLOBAL EVENTS
        socket.on('disconnect', () => {
            io.emit('user disconnected');
        });

        socket.on('statusInit', (status) => {
            io.emit('statusInit', status);
        });

        socket.on('notification', (notification) => {
            io.emit('notification', notification);
        });

        socket.on('statusComment', (comment) => {
            io.emit('statusComment', comment);
        });

        socket.on('statusDelete', (status) => {
            io.emit('statusDelete', status);
        });
    });
};
