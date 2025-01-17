import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatMessageActions, CometChatThreadedMessageReplyCount, CometChatReadReceipt } from "../../";
import { CometChatMessageReactions } from "../";
import { CometChatAvatar } from "../../../Shared";

import { checkMessageForExtensionsData } from "../../../../util/common";

import { theme } from "../../../../resources/theme";
import Translator from "../../../../resources/localization/translator";

import {
    messageContainerStyle,
    messageWrapperStyle,
    messageThumbnailStyle,
    messageDetailStyle,
    nameWrapperStyle,
    nameStyle,
    messageTxtContainerStyle,
    messageTxtWrapperStyle,
    messageTxtTitleStyle,
    messageTxtStyle,
    messageBtnStyle,
    messageInfoWrapperStyle,
    messageReactionsWrapperStyle
} from "./style";

import whiteboardIcon from "./resources/receiverwhiteboard.png";

class CometChatReceiverWhiteboardBubble extends React.PureComponent {

    messageFrom = "receiver";

    constructor(props) {

        super(props);

        const message = Object.assign({}, props.message, { messageFrom: this.messageFrom });
        this.state = {
            message: message,
            isHovering: false
        }
    }

    componentDidUpdate(prevProps) {

        const previousMessageStr = JSON.stringify(prevProps.message);
        const currentMessageStr = JSON.stringify(this.props.message);

        if (previousMessageStr !== currentMessageStr) {

            const message = Object.assign({}, this.props.message, { messageFrom: this.messageFrom });
            this.setState({ message: message })
        }
    }

    launchCollaborativeWhiteboard = () => {

        let whiteboardUrl = null;
        let whiteboardData = checkMessageForExtensionsData(this.state.message, "whiteboard");
        if (whiteboardData
        && whiteboardData.hasOwnProperty("board_url")
        && whiteboardData.board_url.length) {

            let username = this.props.loggedInUser.name.split(' ').join('_');
            // Appending the username to the board_url
            whiteboardUrl = whiteboardData.board_url + '&username=' + username;
            this.props.setLeft({label:'whiteboard',url: whiteboardUrl})
            // window.open(whiteboardUrl, '', 'fullscreen=yes, scrollbars=auto');
        }
    }

    handleMouseHover = () => {
        this.setState(this.toggleHoverState);
    }

    toggleHoverState = (state) => {

        return {
            isHovering: !state.isHovering,
        };
    }

    render() {

        let avatar = null, name = null;
        if (this.state.message.receiverType === CometChat.RECEIVER_TYPE.GROUP) {

            avatar = (
                <div css={messageThumbnailStyle} className="message__thumbnail">
                    <CometChatAvatar user={this.state.message.sender} />
                </div>
            );

            name = (<div css={nameWrapperStyle(avatar)} className="message__name__wrapper">
                <span css={nameStyle(this.props)} className="message__name">{this.props.message.sender.name}</span>
            </div>);
        }

        let messageReactions = null;
        const reactionsData = checkMessageForExtensionsData(this.state.message, "reactions");
        if (reactionsData) {

            if (Object.keys(reactionsData).length) {
                messageReactions = (
                    <div css={messageReactionsWrapperStyle()} className="message__reaction__wrapper">
                        <CometChatMessageReactions  {...this.props} message={this.state.message} reaction={reactionsData} />
                    </div>
                );
            }
        }

        let toolTipView = null;
        if (this.state.isHovering) {
            toolTipView = (<CometChatMessageActions {...this.props} message={this.state.message} name={name} />);
        }

        const documentTitle = `${this.state.message.sender.name} ${Translator.translate("SHARED_COLLABORATIVE_WHITEBOARD", this.props.lang)}`;

        return (
            <div 
            css={messageContainerStyle()} 
            className="receiver__message__container message__whiteboard"
            onMouseEnter={this.handleMouseHover}
            onMouseLeave={this.handleMouseHover}>

                <div css={messageWrapperStyle()} className="message__wrapper">
                    {avatar}
                    <div css={messageDetailStyle()} className="message__details">
                        {name}
                        {toolTipView}
                        <div css={messageTxtContainerStyle()} className="message__whiteboard__container">
                            <div css={messageTxtWrapperStyle(this.props)} className="message__whiteboard__wrapper">
                                <div css={messageTxtTitleStyle(this.props)} className="message__whiteboard__title">
                                    <img src={whiteboardIcon} alt={Translator.translate("COLLABORATIVE_WHITEBOARD", this.props.lang)} />
                                    <p css={messageTxtStyle()} className="whiteboard__title">{documentTitle}</p>
                                </div>
                                
                                <ul css={messageBtnStyle(this.props)} className="whiteboard__button">
                                    <li onClick={this.launchCollaborativeWhiteboard}>
                                        <p>{Translator.translate("JOIN", this.props.lang)}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {messageReactions}

                        <div css={messageInfoWrapperStyle()} className="message__info__wrapper">
                            <CometChatReadReceipt {...this.props} message={this.state.message} />
                            <CometChatThreadedMessageReplyCount {...this.props} message={this.state.message} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Specifies the default values for props:
CometChatReceiverWhiteboardBubble.defaultProps = {
    lang: Translator.getDefaultLanguage(),
    theme: theme
};

CometChatReceiverWhiteboardBubble.propTypes = {
    lang: PropTypes.string,
    theme: PropTypes.object
}

export { CometChatReceiverWhiteboardBubble };