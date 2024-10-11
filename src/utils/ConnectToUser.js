import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/clerk-react';
import { getUser, userAdd } from '../../convex/user';
import { useEffect, useContext } from 'react';
import { ColorContext } from '../Contexts/ColorContext';

export const ConnectToUser = () => {
    const { Cardnotes, setCardnotes } = useContext(ColorContext); // Correct way to access context
    const user = useUser();

    const data = useQuery('user:getUser', user?.email);

    const createUser = CreateUser();

    useEffect(() => {
        if (data) {
            setCardnotes(data); // Update context with fetched data
        } else {
            createUser(); // If no user data, create the user
        }
    }, [data, createUser, setCardnotes]);

    return null; // No need to render anything
};

export const CreateUser = () => {
    const user = useUser();
    const { mutate } = useMutation('user:userAdd');

    const createUser = async () => {
        if (user?.email && user?.fullName) {
            await mutate({ email: user.email, name: user.fullName });
        }
    };

    return createUser; // Return the function to create a user
};
