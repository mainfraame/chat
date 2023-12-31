import {
  ArrowForwardOutlined,
  InfoOutlined,
  SendOutlined
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Stack,
  StackProps,
  styled,
  TextField,
  TextFieldProps,
  Typography
} from '@mui/material';

import { FC, Fragment, useCallback, useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';

import { useChat } from '../hooks';
import { FormatDate } from './FormatDate';
import { Loader } from './Loader';

const StyledBody = styled('div')(props => ({
  '& > form': {
    display: 'contents'
  },
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 0 #0000, 0 0 #0000, 0px 4px 48px #0006',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 64px)',
  maxHeight: '100%',
  outline: 'none',
  zIndex: props.theme.zIndex.modal
}));

const StyledTextField = styled(TextField)<TextFieldProps>({
  flex: 1
});

const StyledHeader = styled('div')(props => ({
  alignItems: 'center',
  borderBottom: `1px solid ${props.theme.palette.grey[500]}`,
  display: 'flex',
  flex: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: props.theme.spacing(1),
  width: '100%'
}));

const StyledInputs = styled(Stack)<StackProps>(props => ({
  margin: props.theme.spacing(2)
}));

const StyledMessage = styled('div', {
  shouldForwardProp: prop => prop !== 'isBot'
})<{ isBot?: boolean }>(props => ({
  alignItems: 'flex-start',
  borderRadius: props.theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  maxWidth: '100%',
  ...(props.isBot ? {} : { alignSelf: 'flex-end' }),
  ...(props.isBot
    ? { background: '#4f4fc4', color: '#fff' }
    : { background: props.theme.palette.grey[300], color: '#000' })
}));

const StyledMessageTypography = styled('div', {
  shouldForwardProp: prop => prop !== 'isBot'
})<{ isBot?: boolean }>(props => ({
  '& > p:not(:last-of-type)': {
    marginBottom: props.theme.spacing(2)
  },
  '& a': {
    color: props.theme.palette.primary.main
  },
  '& li::marker': {
    fontWeight: 700
  },
  '& ol': {
    listStyle: 'auto',
    margin: props.theme.spacing(2, 0)
  },
  '& ol li': {
    marginBottom: props.theme.spacing(1),
    marginLeft: props.theme.spacing(2)
  },
  '& ol li ul': {
    listStyle: 'auto'
  },
  '& p': {
    marginBlockEnd: 0,
    marginBlockStart: 0
  },
  '& pre': {
    margin: props.theme.spacing(2, 0),
    maxWidth: '100%',
    overflowX: 'auto'
  },
  '& ul': {
    listStyle: 'auto',
    margin: props.theme.spacing(3, 0)
  },
  '& ul li': {
    marginBottom: props.theme.spacing(2),
    marginLeft: props.theme.spacing(3)
  },
  maxWidth: '100%',
  overflow: 'hidden',
  padding: props.theme.spacing(1, 2)
}));

const StyledMessages = styled(Stack)<StackProps>(props => ({
  alignItems: 'flex-start',
  borderBottom: `1px solid ${props.theme.palette.grey[600]}`,
  flex: 1,
  overflowY: 'auto',
  padding: props.theme.spacing(2)
}));

const StyledTimestamp = styled('div')(props => ({
  margin: `${props.theme.spacing(1, 1, 0, 1)} !important`
}));

export type ChatBotProps = {
  type: 'llama' | 'openapi';
};

export const ChatBot: FC<ChatBotProps> = props => {
  const $messages = useRef<HTMLDivElement>(null);
  const $scroll = useRef<HTMLDivElement>(null);

  const [messages, meta, send] = useChat(props.type);
  const [question, setQuestion] = useState('');

  const onKeyDown = useCallback(
    e => {
      if (e.key == 'Enter') {
        send(e.target.value);

        setQuestion(() => '');
      }
    },
    [send]
  );

  const onChange = useCallback(e => {
    setQuestion(() => e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    send(question);

    setQuestion(() => '');
  }, [send, question]);

  useUpdateEffect(() => {
    setTimeout(
      () =>
        $scroll.current?.scrollIntoView({
          block: 'end'
        })
    );

    /**
     * reset form once loading is complete
     */
    if (messages[messages.length - 1]?.text === '') {
      setQuestion(() => '');
    }
  }, [messages]);

  return (
    <>
      <StyledBody aria-label='Chat with a bot'>
        <StyledHeader>
          <Typography variant='h6'>{props.type.toUpperCase()}</Typography>
        </StyledHeader>
        <StyledMessages
          aria-label='Chat messages'
          aria-live='polite'
          direction='column'
          ref={$messages}
          role='log'
          spacing={2}>
          {messages.map((msg, index) => (
            <Fragment key={msg.$id}>
              {messages.length - 1 === index &&
              msg.sender === 'bot' &&
              !msg.text ? (
                <Loader
                  color='primary'
                  data-component='Loader'
                  fontSize='large'
                />
              ) : (
                <StyledMessage
                  data-component='chatBotMsg'
                  data-sender={msg.sender}
                  data-testid={index}
                  isBot={msg.sender === 'bot'}
                  key={msg.$id}>
                  {msg.sender === 'bot' && (
                    <StyledMessageTypography
                      dangerouslySetInnerHTML={{
                        __html: `<span class="sr-only" aria-hidden="false">Bot:</span>${msg.text}`
                      }}
                      data-component='chatBotTypography'
                      isBot
                    />
                  )}
                  {msg.sender !== 'bot' && (
                    <StyledMessageTypography data-component='chatBotTypography'>
                      <span aria-hidden='false' className='sr-only'>
                        User:
                      </span>
                      {msg.text}
                    </StyledMessageTypography>
                  )}
                </StyledMessage>
              )}
            </Fragment>
          ))}
          <StyledTimestamp ref={$scroll}>
            <Typography
              sx={{ TypographyTransform: 'lowercase' }}
              variant='caption'>
              {meta.timestamp && (
                <FormatDate
                  format='MM/dd/yyyy hh:mm:ssb'
                  value={meta.timestamp}
                />
              )}
            </Typography>
          </StyledTimestamp>
          {(!meta.connected || !meta.healthy) && (
            <Stack alignItems='center' direction='column' spacing={1}>
              <InfoOutlined
                aria-label='information'
                color='error'
                fontSize='large'
              />
              <Typography align='center' mb={0}>
                AI Chat is currently unavailable
              </Typography>
              <Typography align='center' color='grey' mb={0}>
                Please visit our help center or contact us
              </Typography>
              <Button
                color='primary'
                endIcon={
                  <ArrowForwardOutlined color='inherit' fontSize='small' />
                }
                href='/path'
                target='_blank'
                variant='text'>
                Help Center
              </Button>
            </Stack>
          )}
        </StyledMessages>
        <StyledInputs alignItems='center' direction='row' spacing={2}>
          <StyledTextField
            multiline
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={question}
          />
          <IconButton
            aria-label='submit'
            color='primary'
            disabled={!meta.connected || !meta.healthy}
            onClick={onSubmit}>
            <SendOutlined />
          </IconButton>
        </StyledInputs>
      </StyledBody>
    </>
  );
};

ChatBot.displayName = 'ChatBot';
