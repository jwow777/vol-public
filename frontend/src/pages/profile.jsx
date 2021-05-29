import React from "react";
import {
  Page,
  Navbar,
  Link,
  NavRight,
} from "framework7-react";
import "framework7-icons";
import "../css/app.scss";

export default () => {
  return (
    <Page>
      <Navbar className='profile-navbar'>
        <div className='profile-navbar-box'>
          <img src='https://sun9-58.userapi.com/impf/c851420/v851420705/15238f/44MFMbCQbmI.jpg?size=1440x2160&quality=96&sign=c0fd731bab118ef858ae2564e06d4a26&type=album' className='profile-icon'/>
          <h2 className='profile-title'>
            Alexey Tatarinov
          </h2>
          <p className='profile-subtitle'>@alexey</p>
          <a href='tel:79629354124' className='profile-phone'>+7 (962) 935-41-24</a>
        </div>
        <NavRight>
          <Link
            back={true}
            iconIos="f7:chevron_left"
            iconAurora="f7:chevron_left"
            iconMd="material:more_vert"
          />
        </NavRight>
      </Navbar>
    </Page>
  );
};
