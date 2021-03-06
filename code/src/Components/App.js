import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostInput from './PostInput';
import PostList from './PostList';
import Sort from './Sort';
import { MESSAGE_URL } from '../Urls';
import Loader from './Loader';
import './Style.css';

export const App = () => {
	const [messages, setMessages] = useState([]);
	const [totalMessages, setTotalMessages] = useState();
	const [isLoading, setLoading] = useState(true); 
	const [sort, setSort] = useState('newest')
	const [page, setPage] = useState(1) 

	useEffect(() => {
		fetchMessages();
		//eslint-disable-next-line
	}, [page, sort]);

	const fetchMessages = () => {
		fetch(MESSAGE_URL + `?page=${page}&sort=${sort}`)
			.then(res => res.json())
			.then(data => {
				setMessages(data.results);
				setTotalMessages(data.total)
				setLoading(false);
			})
			.catch(error => console.error(error));
	};
	
	const postSingleMessage = (message, name) => {
		fetch(MESSAGE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: message, name: name }),
		})
			.then(() => fetchMessages())
			.catch(error => console.error(error));
	};

	const postSingleLike = id => {
		fetch(`https://happy-thoughts.herokuapp.com/thoughts/${id}/like`, {
			method: 'POST',
			body: '',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(() => fetchMessages())
			.catch(error => console.error(error));
	};

	return (
		<main>
			<PostInput onMessageChange={postSingleMessage} />
			{isLoading ? (
				<Loader className="loader" />
			) : (
				<>
					<Sort onClick={(event) => setSort(event.target.value)} /> 
					<InfiniteScroll
						dataLength={messages.length} 
						next={() => setPage(page+1)}
						hasMore={messages.length < totalMessages ? true : false}
						scrollThreshold={1}
						loader={<h4>Loading...</h4>}
						endMessage={<h5>All thoughts displayed!</h5>}
					>
						<PostList postList={messages} onLikeChange={postSingleLike} /> 
					</InfiniteScroll>
				</>
			)}
		</main>
	);
};
