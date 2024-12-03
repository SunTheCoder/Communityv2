import React from "react"
import { VStack } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "./ui/avatar";


const FriendAvatarGroup = () => {



    return (
        <VStack gap="3" position='absolute' top='80px' left='16px'>
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
            <Avatar size="xs" name="Sage" src="https://placehold.co/100" />
        </VStack>
    )}

export default FriendAvatarGroup;

