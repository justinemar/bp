import React from "react";
import "./notification.css";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8080");

class DashBoardNotification extends React.Component {
    state = {
        notifications: []
    };

    componentDidMount() {
        socket.on("notification", data => {
            console.log(data);
            this.setState(prevState => ({
                notifications: [data, ...prevState.notifications]
            }));
        });
    }

    render() {
        const { notifications } = this.state;
        const dataToRender = notifications
            ? notifications.map(i => {
                const background =
                    i.post_img && i.post_img.imageArray !== undefined
                        ? i.post_img.imageArray[0]
                        : null;
                return (
                    <div
                        className="a-notification"
                        style={{ backgroundImage: `url(${background})` }}
                    >
                        <div className="notification-detail">
                            <p>
                                <span>{`A new update from ${i.post_by.display_name}`}</span>
                            </p>
                            <p>{`${i.post_description}`}</p>
                        </div>
                    </div>
                );
            })
            : null;
        return (
            <div className="dashboard-notification">
                <span className="dashboard-notification-title">
                    Recent Updates
                    <button type="button" onClick={() => this.turnOff()}>
                        Turn off
                    </button>
                </span>
                <div className="dashboard-notification-main">{dataToRender}</div>
            </div>
        );
    }
}

export default DashBoardNotification;
