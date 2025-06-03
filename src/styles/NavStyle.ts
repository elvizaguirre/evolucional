import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavBar = styled.nav`
  padding: 1rem;
  background: #eee;
  display: flex;
  gap: 1rem;
`;

export const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
