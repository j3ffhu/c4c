import { FormEvent, useCallback, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Text,
  Input,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';

type Shortened = {
  original: string;
  short: string;
};

export function App() {
  const [urls, setUrls] = useState<Array<Shortened>>([]);
  const [inputUrl, setInputUrl] = useState<string>('');
  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const response = await axios.post(`http://localhost:3333/api/shorten`, {
        original: inputUrl,
      });

      const newUrl = response.data as Shortened;

      setUrls([newUrl, ...urls]);
      setInputUrl('');
    },
    [urls, setUrls, inputUrl, setInputUrl]
  );

  return (
    <Container maxWidth="4xl" marginBlock={10} textAlign="center">
      <Text fontSize="4xl">My URL Shortener</Text>
      <form onSubmit={onSubmit}>
        <Input
          size="lg"
          marginBlock={4}
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
          }}
          placeholder="www.my-super-long-url-here.com/12345"
        />
        <Button type="submit" colorScheme="teal" size="lg">
          Generate
        </Button>
      </form>

      <UnorderedList textAlign="left">
        {urls.map((u) => (
          <ListItem>
            <Link href={u.short} color="teal.500">
              {u.short}
            </Link>{' '}
            - {u.original}
          </ListItem>
        ))}
      </UnorderedList>
    </Container>
  );
}

export default App;