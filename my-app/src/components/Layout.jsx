import React, {useState} from "react";

import { Grid, GridItem, Box, Heading, Text, Tabs} from "@chakra-ui/react";
import AddResourceDrawer from "./AddResourceDrawer";
import SignUp from "./SignUp";
import ResourceList from "./ResourceList";
import { ColorModeButton } from "./ui/color-mode"; // Adjust the path if necessary

const Layout = () => {
    const [value, setValue] = useState("first")

  return (
    <>
      <ColorModeButton />
      <Tabs.Root 
      value={value} 
      onValueChange={(e) => setValue(e.value)}
      
      >
      <Tabs.List style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Tabs.Trigger value="first">First tab</Tabs.Trigger>
        <Tabs.Trigger value="second">Second tab</Tabs.Trigger>
        <Tabs.Trigger value="third">Third tab</Tabs.Trigger>
        <Tabs.Trigger value="fourth">Fourth tab</Tabs.Trigger>
        <Tabs.Trigger value="fifth">Fifth tab</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="first">
        <ResourceList />
            <Box display="flex" justifyContent="center" mt={4}>
                <AddResourceDrawer />
            </Box>
    
      </Tabs.Content>
      <Tabs.Content value="second">
        <Box>
          <Heading as="h3">Sign Up</Heading>
          <SignUp />
        </Box>
      </Tabs.Content>
      <Tabs.Content value="third">
        <Text>Another additional content</Text>
      </Tabs.Content>
      <Tabs.Content value="fourth">
        <Text>Another additional content</Text>
      </Tabs.Content>
      <Tabs.Content value="fifth">
        <Text>Another additional content</Text>
      </Tabs.Content>
    </Tabs.Root>
  </>
  );
};

export default Layout;
