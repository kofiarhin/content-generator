import { render, screen } from '@testing-library/react';
import ResultCard from '../ResultCard';

const asset = {
  id: '1',
  title: 'Test Asset',
  type: 'youtube_idea',
  body: 'Body copy'
};

describe('ResultCard', () => {
  it('renders title and body', () => {
    render(<ResultCard asset={asset} />);
    expect(screen.getByText('Test Asset')).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });
});
