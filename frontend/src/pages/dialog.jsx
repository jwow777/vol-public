import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Navbar,
  Messagebar,
  Link,
  MessagebarAttachments,
  MessagebarAttachment,
  MessagebarSheet,
  MessagebarSheetImage,
  Messages,
  MessagesTitle,
  Message,
  f7,
  f7ready,
  NavRight,
  Block,
  NavTitle
} from "framework7-react";
import "framework7-icons";
import "../css/app.scss";

export default () => {
  const images = [
    "https://cdn.framework7.io/placeholder/cats-300x300-1.jpg",
    "https://cdn.framework7.io/placeholder/cats-200x300-2.jpg",
    "https://cdn.framework7.io/placeholder/cats-400x300-3.jpg",
    "https://cdn.framework7.io/placeholder/cats-300x150-4.jpg",
    "https://cdn.framework7.io/placeholder/cats-150x300-5.jpg",
    "https://cdn.framework7.io/placeholder/cats-300x300-6.jpg",
    "https://cdn.framework7.io/placeholder/cats-300x300-7.jpg",
    "https://cdn.framework7.io/placeholder/cats-200x300-8.jpg",
    "https://cdn.framework7.io/placeholder/cats-400x300-9.jpg",
    "https://cdn.framework7.io/placeholder/cats-300x150-10.jpg"
  ];
  const people = [
    {
      name: "Alexey Tatarinov",
      avatar: "https://cdn.framework7.io/placeholder/people-100x100-9.jpg"
    }
  ];
  const answers = [
    "Yes!",
    "No",
    "Hm...",
    "I am not sure",
    "And what about you?",
    "May be ;)",
    "Lorem ipsum dolor sit amet, consectetur",
    "What?",
    "Are you sure?",
    "Of course",
    "Need to think about it",
    "Amazing!!!"
  ];
  const [attachments, setAttachments] = useState([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messagesData, setMessagesData] = useState([
    {
      type: "received",
      text: "Why are you doing a messenger? It’s only  my schtick :(",
      time: "12:59"
    },
    {
      type: "sent",
      text:
        "Some people don't like change, but you need to embrace change if the alternative is disaster. We need your’s and slack’s users.",
      time: "13:14"
    },
    {
      type: "sent",
      text: "Hey, look, cutest kitten ever!",
      time: "13:25"
    },
    {
      type: "sent",
      image: "https://cdn.framework7.io/placeholder/cats-200x260-4.jpg",
      time: "13:31"
    },
    {
      type: "received",
      text: "Nice!",
      time: "13:47"
    },
    {
      type: "received",
      text: "Like it very much!",
      time: "13:50"
    },
    {
      type: "received",
      text: "Awesome!",
      time: "14:01"
    },
    {
      type: "received",
      text: "Nice!",
      time: "13:47"
    },
    {
      type: "received",
      text: "Like it very much!",
      time: "13:50"
    },
    {
      type: "received",
      text: "Awesome!",
      time: "14:01"
    }
  ]);

  const responseInProgress = useRef(false);
  const messagebar = useRef(null);

  const attachmentsVisible = () => {
    return attachments.length > 0;
  };
  const placeholder = () => {
    return attachments.length > 0 ? "Add comment or Send" : "Message";
  };
  useEffect(() => {
    f7ready(() => {
      messagebar.current = f7.messagebar.get(".messagebar");
    });
  });
  const deleteAttachment = (image) => {
    const index = attachments.indexOf(image);
    attachments.splice(index, 1);
    setAttachments([...attachments]);
  };
  const handleAttachment = (e) => {
    const index = f7.$(e.target).parents("label.checkbox").index();
    const image = images[index];
    if (e.target.checked) {
      // Add to attachments
      attachments.unshift(image);
    } else {
      // Remove from attachments
      attachments.splice(attachments.indexOf(image), 1);
    }
    setAttachments([...attachments]);
  };
  const sendMessage = () => {
    const text = messageText.replace(/\n/g, "<br>").trim();
    const messagesToSend = [];
    attachments.forEach((attachment) => {
      messagesToSend.push({
        image: attachment
      });
    });
    if (text.length) {
      messagesToSend.push({
        text
      });
    }
    if (messagesToSend.length === 0) {
      return;
    }
    setAttachments([]);
    setSheetVisible(false);
    setMessagesData([...messagesData, ...messagesToSend]);
    setMessageText("");

    // Focus area
    if (text.length) messagebar.current.focus();

    // Mock response
    if (responseInProgress.current) return;

    responseInProgress.current = true;

    setTimeout(() => {
      const answer = answers[Math.floor(Math.random() * answers.length)];
      const person = people[Math.floor(Math.random() * people.length)];
      setTypingMessage({
        name: person.name
      });
      setTimeout(() => {
        setTypingMessage(null);
        setMessagesData([
          ...messagesData,
          {
            text: answer,
            type: "received",
            name: person.name,
            avatar: person.avatar
          }
        ]);
        responseInProgress.current = false;
      }, 4000);
    }, 1000);
  };
  return (
    <Page>
      <Navbar
        backLink={true}
      > 
        <Link href='/profile' className='message-profile-navbar'>
          <img src='https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album' className='message-profile-icon'/>
          <h2 className='message-profile-title'>
            Alexey Tatarinov
          </h2>
          <p className='message-profile-subtitle'>Today 14:03</p>
        </Link>
        <NavRight>
          <Link
            iconIos="f7:ellipsis_vertical"
            iconAurora="f7:ellipsis_vertical"
            iconMd="material:more_vert"
          />
        </NavRight>
      </Navbar>
      <Messagebar
        placeholder={placeholder()}
        attachmentsVisible={attachmentsVisible()}
        sheetVisible={sheetVisible}
        value={messageText}
        onInput={(e) => setMessageText(e.target.value)}
      >
        <Link
          iconIos="f7:paperclip"
          iconAurora="f7:paperclip"
          iconMd="material:attach_file"
          iconColor='black'
          slot="inner-start"
          onClick={() => {
            setSheetVisible(!sheetVisible);
          }}
        />
        <Link
          iconIos="f7:arrow_up_circle_fill"
          iconAurora="f7:arrow_up_circle_fill"
          iconMd="material:send"
          iconColor='black'
          slot="inner-end"
          onClick={sendMessage}
        />
        {/* Добавление изображений */}
        <MessagebarAttachments>
          {attachments.map((image, index) => (
            <MessagebarAttachment
              key={index}
              image={image}
              onAttachmentDelete={() => deleteAttachment(image)}
            />
          ))}
        </MessagebarAttachments>
        <MessagebarSheet>
          {images.map((image, index) => (
            <MessagebarSheetImage
              key={index}
              image={image}
              checked={attachments.indexOf(image) >= 0}
              onChange={handleAttachment}
            />
          ))}
        </MessagebarSheet>
      </Messagebar>

      <Messages>
        <MessagesTitle>
          <b>26 мая</b>
        </MessagesTitle>
        {/* Генерация сообщений */}
        {messagesData.map((message, index) => (
          <Message
            key={index}
            type={message.type}
            image={message.image}
            tail={true}
          >
            {message.text && (
              <span
                slot="text"
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            )}
            {!message.image && (
              <div className="message-text-footer">{message.time}</div>
            )}
          </Message>
        ))}
        {/* Набирание сообщения */}
        {typingMessage && (
          <Message
            type="received"
            typing={true}
            first={true}
            last={true}
            tail={true}
            header={`${typingMessage.name} is typing`}
          />
        )}
      </Messages>
    </Page>
  );
};
