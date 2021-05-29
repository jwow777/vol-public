import React from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  Block,
  Row,
  Col,
  Button,
  Link,
  f7,
  Toolbar,
  Tabs,
  Tab,
  List,
  ListItem,
  AccordionContent,
  Icon,
  Badge,
  NavLeft,
  Searchbar
} from 'framework7-react';
import i18n from '../js/i18nextConf';
import {withTranslation} from "react-i18next";
import tabs2 from "../static/icons/tabs2.svg";
import tabs3 from "../static/icons/tabs3.svg";

const eng = (e) => {
    i18n.changeLanguage('en')
}

const rus = (e) => {
    i18n.changeLanguage('ru')
}

const logout = () => {
  f7.params.user.logout()
  location.reload()
}

const listChats = [
  {
    link: "#",
    title: "Templorary Chat",
    after: "17:14",
    badge: "4",
    text: "Check all docs pls"
  },
  {
    link: "#",
    title: "Suprchat",
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Project Sport",
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Units",
    after: "15:32",
    badge: "5",
    text: "Give me 1% of Amazon shares,"
  },
  {
    link: "#",
    title: "Reglaments",
    after: "17:14",
    badge: "4",
    text: "Wats upp?"
  },
  {
    link: "#",
    title: "Ilon Musk",
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Donald Trump",
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Jeff Bezos",
    after: "15:32",
    badge: "5",
    text: "Give me 1% of Amazon shares,"
  }
];

const listDialogs = [
  {
    link: "#",
    title: "Alexey Tatarinov",
    image: 'https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album',
    after: "17:14",
    badge: "4",
    text: "Wats upp?"
  },
  {
    link: "#",
    title: "Ilon Musk",
    image: 'https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102',
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Donald Trump",
    image: 'https://www.stylist.co.uk/images/app/uploads/2018/01/24130310/donald-trump-desk-crop-1516799013-746x746.jpg?w=256&h=256&fit=max&auto=format%2Ccompress',
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Jeff Bezos",
    image: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    after: "15:32",
    badge: "5",
    text: "Give me 1% of Amazon shares,"
  },
  {
    link: "#",
    title: "Alexey Tatarinov",
    image: 'https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album',
    after: "17:14",
    badge: "4",
    text: "Wats upp?"
  },
  {
    link: "#",
    title: "Ilon Musk",
    image: 'https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102',
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Donald Trump",
    image: 'https://www.stylist.co.uk/images/app/uploads/2018/01/24130310/donald-trump-desk-crop-1516799013-746x746.jpg?w=256&h=256&fit=max&auto=format%2Ccompress',
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Jeff Bezos",
    image: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    after: "15:32",
    badge: "5",
    text: "Give me 1% of Amazon shares,"
  },
  {
    link: "#",
    title: "Alexey Tatarinov",
    image: 'https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album',
    after: "17:14",
    badge: "4",
    text: "Wats upp?"
  },
  {
    link: "#",
    title: "Ilon Musk",
    image: 'https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102',
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Donald Trump",
    image: 'https://www.stylist.co.uk/images/app/uploads/2018/01/24130310/donald-trump-desk-crop-1516799013-746x746.jpg?w=256&h=256&fit=max&auto=format%2Ccompress',
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Jeff Bezos",
    image: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    after: "15:32",
    badge: "5",
    text: "Give me 1% of Amazon shares,"
  },
  {
    link: "#",
    title: "Alexey Tatarinov",
    image: 'https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album',
    after: "17:14",
    badge: "4",
    text: "Wats upp?"
  },
  {
    link: "#",
    title: "Ilon Musk",
    image: 'https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102',
    after: "17:11",
    badge: "1",
    text: "Mb to Mars? Next weekend"
  },
  {
    link: "#",
    title: "Donald Trump",
    image: 'https://www.stylist.co.uk/images/app/uploads/2018/01/24130310/donald-trump-desk-crop-1516799013-746x746.jpg?w=256&h=256&fit=max&auto=format%2Ccompress',
    after: "16:48",
    text: "I have a golden toilet."
  },
  {
    link: "#",
    title: "Jeff Bezos",
    image: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    after: "15:32",
    badge: "5",
    text: "Give me 111% of Amazon shares,"
  }
];


const HomePage = ({ t }) => (
  <Page name="home">
    {/* Top Navbar */}
    {/* <Navbar>
      <NavTitle>VOL Messenger</NavTitle>
    </Navbar> */}
    {/* Bottom Navbar */}
    <Toolbar tabbar position='bottom'>
      <Link
        iconIos='f7:person_2_fill'
        iconAurora="f7:person_2_fill"
        iconMd="material:attach_file"
        iconSize='26px'
        tabLink="#tab-1"
      />
      <Link
        iconSize='26px'
        tabLink="#tab-2"
      >
        <img src={tabs2} alt='' className="icon f7-icons tabs2"/>
      </Link>
      <Link
        iconSize='26px'
        tabLink="#tab-3"
        tabLinkActive
      >
        <img src={tabs3} alt='' className="icon f7-icons tabs3"/>
      </Link>
      <Link
        iconIos='f7:bubble_left_bubble_right_fill'
        iconAurora="f7:bubble_left_bubble_right_fill"
        iconMd="material:attach_file"
        iconSize='26px'
        tabLink="#tab-4"
      />
    </Toolbar> 
    <Tabs>
      <Tab id="tab-1" className="page-content">
        {/* Page content */}
        <Navbar>
          <NavLeft>
            <Link
              iconIos="f7:bars"
              iconAurora="f7:bars"
              iconMd="material:menu"
              iconSize='30px'
            />
          </NavLeft>
          <NavTitle>
            <Searchbar 
              disableButton={false}
              searchContainer=".contact-list"
              searchIn='.item-title, .item-after'
              placeholder="Search by name and position"
            >
            </Searchbar>
          </NavTitle>
        </Navbar>
        <List accordionList className='contact-list'>
          <ListItem accordionItem title="Developers">
            <AccordionContent>
              <List>
                <ListItem title="Bill Gates" after="Senior developer" className='contact-list-item'>
                  <img src='data:image/jpeg;base64,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' slot="media" width='30' />
                </ListItem>
                <ListItem title="Ilon Musk" after="Middle developer" className='contact-list-item'>
                  <img src='https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102' slot="media" width='30' />
                </ListItem>
                <ListItem title="Donald Trump" after="Junior developer" className='contact-list-item'>
                  <img src='https://www.stylist.co.uk/images/app/uploads/2018/01/24130310/donald-trump-desk-crop-1516799013-746x746.jpg?w=256&h=256&fit=max&auto=format%2Ccompress' slot="media" width='30' />
                </ListItem>
              </List>
            </AccordionContent>
          </ListItem>
        </List>
        <List accordionList className='contact-list'>
          <ListItem accordionItem title="Top Management">
            <AccordionContent>
              <List>
                <ListItem title="Jeff Bezos" after="CEO" className='contact-list-item'>
                  <img src='https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg' slot="media" width='30' />
                </ListItem>
              </List>
            </AccordionContent>
          </ListItem>
        </List>
      </Tab>
      <Tab id="tab-2" className="page-content">
        {/* Page content */}
        <Navbar>
          <NavLeft>
            <Link
              iconIos="f7:bars"
              iconAurora="f7:bars"
              iconMd="material:menu"
              iconSize='30px'
            />
          </NavLeft>
          <NavTitle>
            <Searchbar 
              placeholder="Search">
            </Searchbar>
          </NavTitle>
        </Navbar>
        <Block>
            <p>{t("home.hello")}</p>
        </Block>
        <Block strong>
            <Row>
                <Col>
                    <Button fill onClick={eng}>Англ</Button>
                </Col>
                <Col>
                    <Button fill onClick={rus}>Рус</Button>
                </Col>
            </Row>
            <Row>
              <Col>
                <Link href="/login">Login</Link>
              </Col>
              <Col>
                <Link onClick={logout}>Logout</Link>
              </Col>
            </Row>
        </Block>
      </Tab>
      <Tab id="tab-3" className="page-content chats" tabActive>
        {/* Page content */}
        <Navbar>
          <NavLeft>
            <Link
              iconIos="f7:bars"
              iconAurora="f7:bars"
              iconMd="material:menu"
              iconSize='30px'
            />
          </NavLeft>
          <NavTitle>
            <Searchbar
              disableButton={false}
              searchContainer=".chats-list"
              searchIn='.item-title, .item-text'
              placeholder="Search by chats and message"
            >
            </Searchbar>
          </NavTitle>
        </Navbar>
        <List mediaList className="chats-list">
          {listChats.map((item, index) => (
            <ListItem
              link="#"
              title={item.title}
              text={item.text}
              key={index}
              className="chats-list-item"
            >
              <div slot="inner-start" className="chats-list-start-box">
                <Badge>{item.title.slice(0, 1)}</Badge>
              </div>
              <div slot="inner" className="chats-list-after-box">
                <p className="chats-list-after-item">{item.after}</p>
                {item.badge && <Badge>{item.badge}</Badge>}
              </div>
            </ListItem>
          ))}
        </List>
      </Tab>
      <Tab id="tab-4" className="page-content dialogs">
        {/* Page content */}
        <Navbar>
          <NavLeft>
            <Link
              iconIos="f7:bars"
              iconAurora="f7:bars"
              iconMd="material:menu"
              iconSize='30px'
            />
          </NavLeft>
          <NavTitle>
            <Searchbar
              disableButton={false}
              searchContainer=".dialogs-list"
              searchIn='.item-title, .item-text'
              placeholder="Search by name and message"
            >
            </Searchbar>
          </NavTitle>
        </Navbar>
        <List mediaList className="dialogs-list">
          {listDialogs.map((item, index) => (
            <ListItem
              link="/dialog"
              title={item.title}
              text={item.text}
              key={index}
              className="dialogs-list-item"
            >
              <div slot="inner-start" className="dialogs-list-start-box">
                <img src={item.image} alt={item.title} className='dialogs-list-start-image'/>
              </div>
              <div slot="inner" className="dialogs-list-after-box">
                <p className="dialogs-list-after-item">{item.after}</p>
                {item.badge && <Badge>{item.badge}</Badge>}
              </div>
            </ListItem>
          ))}
        </List>
      </Tab>
    </Tabs>
  </Page>
);
export default withTranslation()(HomePage);