import {topics as sourceTopics} from './museum-source-topics.js';
import {topics as existingTopics} from './topics.js';
// Museum content is independent of the unchanged gallery and hero assets.
export const topics=sourceTopics.map((topic,index)=>({...topic,image:existingTopics[index].image,imageAlt:existingTopics[index].short}));
