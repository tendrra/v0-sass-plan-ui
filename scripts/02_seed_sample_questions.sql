-- Insert sample speaking questions
INSERT INTO speaking_questions (
  id,
  title,
  type,
  prompt_text,
  difficulty,
  is_active
) VALUES
(
  gen_random_uuid(),
  'Road bicycle racing',
  'read_aloud',
  'Road bicycle racing is the cycle sports discipline of road cycling, held on paved roads. Road racing is the most popular professional form of bicycle racing in terms of numbers of competitors event, and spectators. The two most common competition formats are mass start events, where riders start simultaneously and race to set finish point; and time trials, where individual riders or teams race a course alone against the clock.',
  'medium',
  true
),
(
  gen_random_uuid(),
  'Climate Change Impact',
  'read_aloud',
  'Climate change is having profound effects on our planet ecosystems. Rising temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists worldwide are working to understand and mitigate these changes, but immediate action is required from governments and individuals alike.',
  'hard',
  true
),
(
  gen_random_uuid(),
  'Artificial Intelligence',
  'read_aloud',
  'Artificial intelligence has revolutionized many aspects of modern life. From voice assistants to autonomous vehicles, AI systems are becoming increasingly sophisticated. However, this rapid advancement also raises important questions about ethics, privacy, and the future of human employment.',
  'medium',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample writing questions
INSERT INTO writing_questions (
  id,
  title,
  type,
  prompt_text,
  difficulty,
  is_active
) VALUES
(
  gen_random_uuid(),
  'Summarize Written Text',
  'summarize_written_text',
  'Read the passage below and summarize it using one sentence. You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage.

Technology has transformed the way we communicate, work, and live. The internet has connected billions of people worldwide, enabling instant communication and access to vast amounts of information. However, this digital revolution has also brought challenges, including privacy concerns, information overload, and the need for digital literacy.',
  'medium',
  true
),
(
  gen_random_uuid(),
  'Write Essay - Education',
  'essay',
  'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer.

What, in your opinion, should be the main function of a university? Write 200-300 words.',
  'hard',
  true
)
ON CONFLICT (id) DO NOTHING;
