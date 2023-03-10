import redPacket from '../assets/8-bit-redpacket.png';
import '../styles/RedPacketClicker.scss';
import { useState, useEffect } from 'react';
import ItemsDisplayInClicker from './ItemsDisplayInClicker';
import InstructionModal from './InstructionModal';
import SocialsModal from './SocialsModal';
import ProfilePicture from './common/ProfilePicture';
import Comments from './Comments';
import Leaderboard from './Leaderboard';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import { useAuthenticated } from '../hooks/useAuthenticated';

export default function RedPacketClicker() {
  const [userData, setUserData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useAuthenticated();
  const [clicks, setClicks] = useState(0);
  const id = AUTH.getPayload().sub;

  useEffect(() => {
    API.GET(API.ENDPOINTS.singlePocket(id)).then(({ data }) => {
      setUserData(data);
      setIsUpdated(false);
    });
  }, [id, isUpdated]);

  const handleUpdate = (e) => {
    setIsUpdated(true);
  };

  const handleClick = (e) => {
    setClicks((click) => (click += userData?.multiplier));
    localStorage.setItem('number_of_red_packets', clicks);
    setUserData({
      ...userData,
      number_of_red_packets:
        userData?.number_of_red_packets + userData?.multiplier
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const apiReqBody = {
        number_of_red_packets: userData?.number_of_red_packets
      };

      API.PUT(
        API.ENDPOINTS.singlePocket(userData?.id),
        apiReqBody,
        API.getHeaders()
      );
      localStorage.setItem('number_of_red_packets', 0);
      setIsUpdated(true);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className='clicker-page-container'>
        <div className='items-display-div'>
          <ItemsDisplayInClicker
            numberOfRedPackets={userData?.number_of_red_packets}
            userItems={userData?.items}
            userId={userData?.id}
            userMultiplier={userData?.multiplier}
            isUpdatedFunction={handleUpdate}
          />
        </div>
        <div className='middle-section'>
          <div className='modals-div'>
            <InstructionModal />
            <SocialsModal />
          </div>
          <div className='red-packet-div'>
            {isLoggedIn ? (
              <img
                src={redPacket}
                alt='red-packet-clicker-button'
                onClick={handleClick}
                className='red-packet-clicker-button'
              ></img>
            ) : (
              <img
                src={redPacket}
                alt='red-packet-clicker-button'
                className='red-packet-clicker-button'
              ></img>
            )}
          </div>
          <div className='user-info-div'>
            {isLoggedIn ? (
              <>
                <div className='clicker-pp-username-div'>
                  <ProfilePicture
                    cloudinaryImageId={userData?.owner.profile_image}
                    imageHeight={80}
                    imageWidth={80}
                    className='clicker-profile-picture'
                  />
                  <h1 className='user-title'>
                    {userData?.owner.username}'s Pocket
                  </h1>
                </div>
                <h3 className='user-current-rp'>
                  Red Packets earned:{' '}
                  <span>{userData?.number_of_red_packets}</span>
                  <p> </p>
                </h3>
                <h4 className='user-multiplier'>
                  Red Packet Bonus Per Click:{' '}
                  <span>{userData?.multiplier}</span>
                </h4>
                <br />
                <button className='button' onClick={handleSubmit}>
                  SAVE YOUR PROGRESS
                </button>
              </>
            ) : (
              <h3>REGISTER NOW TO START EARNING RED PACKETS!</h3>
            )}
          </div>
        </div>
        <div className='right-section'>
          <Leaderboard updateStatus={isUpdated} />
          <Comments />
        </div>
      </div>
    </>
  );
}
