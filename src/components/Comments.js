import moment from 'moment';
import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { useAuthenticated } from '../hooks/useAuthenticated';
import '../styles/Comments.scss';

export default function Comments() {
  const [comments, setComments] = useState(null);
  const [commentField, setCommentField] = useState({
    text: ''
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useAuthenticated();

  const handleChange = (e) => {
    e.preventDefault();
    setCommentField({ ...commentField, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.POST(API.ENDPOINTS.allComments, commentField, API.getHeaders());
    setCommentField({ text: '' });
    setIsUpdated(true);
  };

  useEffect(() => {
    API.GET(API.ENDPOINTS.allComments)
      .then(({ data }) => setComments(data))
      .catch((error) => console.error(error));
    setIsUpdated(false);
  }, [isUpdated]);

  return (
    <>
      <div className='comments-container'>
        <h2 className='comments-title'>CHATS</h2>
        <div className='comments-display-div'>
          <div>
            {comments?.map((comment) => (
              <div className='single-comment' key={comment.created_at}>
                <p className='comment-username'>{comment.owner.username}:</p>
                <p className='comment-text'>
                  {comment.text}
                  <em className='comment-timestamp'>
                    {' '}
                    at {moment(comment.created_at).fromNow()}
                  </em>
                </p>
              </div>
            ))}
          </div>
        </div>
        {isLoggedIn ? (
          <div className='input-container'>
            <label htmlFor='text' className='input-label'>
              MESSAGE:
            </label>
            <input
              type='text'
              id='text'
              name='text'
              value={commentField.text}
              required
              onChange={handleChange}
            ></input>
            <button type='submit' onClick={handleSubmit}>
              SUBMIT
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
