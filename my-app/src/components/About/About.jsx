import React from 'react';
import { Box, VStack, Heading, Text, Link, List } from '@chakra-ui/react';
import { IoFlowerOutline } from "react-icons/io5";

const About = () => {
  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl" color="pink.600" _dark={{ color: "pink.300" }}>
          About CareMap
        </Heading>


        <Box>
          <Heading size="md" mb={3}>Mission</Heading>
          <Text>
            CareMap is designed to put the power of local knowledge and resources into the hands 
            of the community. Inspired by the resilience and vision of our ancestors—especially 
            remarkable Black women like Fannie Lou Hamer and Harriet Tubman.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>Features</Heading>
          <List.Root>
            <List.Item display="flex" alignItems="center" mb={2}>
              <IoFlowerOutline style={{ marginRight: '8px', color: 'var(--chakra-colors-pink-500)' }} />
              Community Resource Mapping
            </List.Item>
            <List.Item display="flex" alignItems="center" mb={2}>
              <IoFlowerOutline style={{ marginRight: '8px', color: 'var(--chakra-colors-pink-500)' }} />
              Real-time Community Feed
            </List.Item>
            <List.Item display="flex" alignItems="center" mb={2}>
              <IoFlowerOutline style={{ marginRight: '8px', color: 'var(--chakra-colors-pink-500)' }} />
              Resource Sharing Network
            </List.Item>
            <List.Item display="flex" alignItems="center" mb={2}>
              <IoFlowerOutline style={{ marginRight: '8px', color: 'var(--chakra-colors-pink-500)' }} />
              Blockchain Integration (Coming Soon)
            </List.Item>
          </List.Root>
        </Box>

        <Box>
          <Heading size="md" mb={3}>Creator</Heading>
          <Text>
            Created by Sun English Jr., a software engineer passionate about using technology 
            for community empowerment and social justice.
          </Text>
          <Box mb={2}></Box>
          <Link href="https://www.sunthecoder.com">
            <Text color="pink.500">
              View Sun's Portfolio
            </Text>
          </Link>
          <Box mb={2}></Box>
          <Link href="https://github.com/sunthecoder">
            <Text color="pink.500">
              View Sun's GitHub
            </Text>
          </Link>
          <Box mb={2}></Box>
          <Link href="https://www.linkedin.com/in/sunthecoder/">
            <Text color="pink.500">
              View Sun's LinkedIn
            </Text>
          </Link>
        </Box>
        <Box>
          
          <Heading size="md" mb={3}>Contact</Heading>
          <Text>
            For inquiries or collaboration opportunities, reach out at{' '}
            <Link color="pink.500" href="mailto:sunenglishjr@gmail.com">
              sunenglishjr@gmail.com
            </Link>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default About; 