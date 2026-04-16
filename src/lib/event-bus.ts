// src/lib/event-bus.ts
import mitt from "mitt";

type Events = {
  social: { message: string };
  banned: { message: string };
};

export const eventBus = mitt<Events>();