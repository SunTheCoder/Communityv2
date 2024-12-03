import React from "react"
import { VStack } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "./ui/avatar";


const FriendAvatarGroup = () => {



    return (
        <VStack gapY="5" position='absolute' top='80px'>
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
            <Avatar size="sm" name="Sage" src="https://placehold.co/100" />
        </VStack>
    )}

export default FriendAvatarGroup;

