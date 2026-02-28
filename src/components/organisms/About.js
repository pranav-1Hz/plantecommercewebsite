import React from 'react';
import styled from 'styled-components';
import StyledHeading from '../atoms/Heading/Heading';
import Text from '../atoms/Text/Text';

const StyledWrapper = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme.secondaryColor};
  text-align: center;
  margin-top: 5rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const About = () => (
    <StyledWrapper>
        <ContentWrapper>
            <StyledHeading main>About Us</StyledHeading>
            <Text main style={{ textAlign: 'center' }}>
                We are passionate about bringing nature into your home. Our carefully curated collection of plants is designed to transform your living space into a green sanctuary. Whether you are a seasoned plant parent or just starting your journey, we have something for everyone.
            </Text>
        </ContentWrapper>
    </StyledWrapper>
);

export default About;
