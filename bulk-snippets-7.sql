-- Additional Code Snippets
INSERT INTO code_snippets (title, description, content, language, difficulty) VALUES
('GraphQL API with TypeScript', 'Complete GraphQL API setup with type safety', 
'import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
}

// Define schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
`;

// Implement resolvers
const resolvers = {
  Query: {
    users: () => db.users.findMany(),
    user: (_, { id }) => db.users.findUnique({ where: { id } }),
    posts: () => db.posts.findMany(),
    post: (_, { id }) => db.posts.findUnique({ where: { id } })
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      return db.users.create({
        data: { name, email }
      });
    },
    createPost: async (_, { title, content, authorId }) => {
      return db.posts.create({
        data: {
          title,
          content,
          author: { connect: { id: authorId } }
        }
      });
    }
  },
  User: {
    posts: (parent) => db.posts.findMany({
      where: { authorId: parent.id }
    })
  },
  Post: {
    author: (parent) => db.users.findUnique({
      where: { id: parent.authorId }
    })
  }
};

// Create and start server
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});', 'typescript', 'advanced'),

('Python WebSocket Server', 'Real-time WebSocket server implementation', 
'import asyncio
import websockets
import json
from typing import Set, Dict
from dataclasses import dataclass, asdict

@dataclass
class Client:
    websocket: websockets.WebSocketServerProtocol
    user_id: str
    room_id: str | None = None

class ChatServer:
    def __init__(self):
        self.clients: Dict[str, Client] = {}
        self.rooms: Dict[str, Set[str]] = {}

    async def register(self, websocket: websockets.WebSocketServerProtocol, user_id: str):
        client = Client(websocket=websocket, user_id=user_id)
        self.clients[user_id] = client
        await self.broadcast_user_list()

    async def unregister(self, user_id: str):
        if user_id in self.clients:
            client = self.clients[user_id]
            if client.room_id:
                await self.leave_room(user_id, client.room_id)
            del self.clients[user_id]
            await self.broadcast_user_list()

    async def join_room(self, user_id: str, room_id: str):
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(user_id)
        self.clients[user_id].room_id = room_id
        await self.broadcast_room_update(room_id)

    async def leave_room(self, user_id: str, room_id: str):
        if room_id in self.rooms and user_id in self.rooms[room_id]:
            self.rooms[room_id].remove(user_id)
            self.clients[user_id].room_id = None
            if not self.rooms[room_id]:
                del self.rooms[room_id]
            else:
                await self.broadcast_room_update(room_id)

    async def broadcast_message(self, user_id: str, message: str, room_id: str | None = None):
        data = {
            "type": "message",
            "user_id": user_id,
            "content": message,
            "timestamp": datetime.now().isoformat()
        }

        if room_id:
            # Send to room members only
            if room_id in self.rooms:
                for member_id in self.rooms[room_id]:
                    if member_id in self.clients:
                        await self.clients[member_id].websocket.send(json.dumps(data))
        else:
            # Broadcast to all clients
            for client in self.clients.values():
                await client.websocket.send(json.dumps(data))

    async def broadcast_user_list(self):
        data = {
            "type": "users",
            "users": [{"id": uid, "room": client.room_id} 
                     for uid, client in self.clients.items()]
        }
        for client in self.clients.values():
            await client.websocket.send(json.dumps(data))

    async def broadcast_room_update(self, room_id: str):
        if room_id in self.rooms:
            data = {
                "type": "room_update",
                "room_id": room_id,
                "members": list(self.rooms[room_id])
            }
            for member_id in self.rooms[room_id]:
                if member_id in self.clients:
                    await self.clients[member_id].websocket.send(json.dumps(data))

async def handle_connection(websocket, path, server: ChatServer):
    try:
        # Wait for initial connection message with user_id
        message = await websocket.recv()
        data = json.loads(message)
        user_id = data["user_id"]

        await server.register(websocket, user_id)

        async for message in websocket:
            data = json.loads(message)
            if data["type"] == "message":
                await server.broadcast_message(
                    user_id, 
                    data["content"],
                    data.get("room_id")
                )
            elif data["type"] == "join_room":
                await server.join_room(user_id, data["room_id"])
            elif data["type"] == "leave_room":
                await server.leave_room(user_id, data["room_id"])

    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await server.unregister(user_id)

async def main():
    server = ChatServer()
    async with websockets.serve(
        lambda ws, path: handle_connection(ws, path, server),
        "localhost",
        8765
    ):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())', 'python', 'advanced'),

('React Animation Component', 'Reusable animation component with Framer Motion', 
'import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
  animation?: "fade" | "slide" | "scale" | "flip";
  duration?: number;
  delay?: number;
  className?: string;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  flip: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 }
  }
};

export const AnimatedElement: React.FC<Props> = ({
  children,
  animation = "fade",
  duration = 0.3,
  delay = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          {...animations[animation]}
          transition={{
            duration,
            delay,
            ease: "easeInOut"
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Example usage
const AnimatedCard = () => {
  return (
    <AnimatedElement
      animation="slide"
      duration={0.5}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Animated Card</h2>
      <p className="text-gray-600">
        This card animates in with a slide effect.
      </p>
    </AnimatedElement>
  );
};

// List with staggered animations
const AnimatedList = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AnimatedElement
          key={item.id}
          animation="fade"
          delay={index * 0.1}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
        </AnimatedElement>
      ))}
    </div>
  );
};', 'typescript', 'advanced'),

('Go gRPC Service', 'Complete gRPC service implementation in Go', 
'package main

import (
    "context"
    "log"
    "net"
    "google.golang.org/grpc"
    pb "github.com/example/proto"
)

type server struct {
    pb.UnimplementedUserServiceServer
    users map[string]*pb.User
}

func NewServer() *server {
    return &server{
        users: make(map[string]*pb.User),
    }
}

func (s *server) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.User, error) {
    user := &pb.User{
        Id:       uuid.New().String(),
        Name:     req.Name,
        Email:    req.Email,
        Role:     req.Role,
        Created:  timestamppb.Now(),
        Modified: timestamppb.Now(),
    }
    
    s.users[user.Id] = user
    return user, nil
}

func (s *server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    user, exists := s.users[req.Id]
    if !exists {
        return nil, status.Errorf(codes.NotFound, "user not found: %v", req.Id)
    }
    return user, nil
}

func (s *server) UpdateUser(ctx context.Context, req *pb.UpdateUserRequest) (*pb.User, error) {
    user, exists := s.users[req.User.Id]
    if !exists {
        return nil, status.Errorf(codes.NotFound, "user not found: %v", req.User.Id)
    }
    
    user.Name = req.User.Name
    user.Email = req.User.Email
    user.Role = req.User.Role
    user.Modified = timestamppb.Now()
    
    return user, nil
}

func (s *server) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
    if _, exists := s.users[req.Id]; !exists {
        return nil, status.Errorf(codes.NotFound, "user not found: %v", req.Id)
    }
    
    delete(s.users, req.Id)
    return &pb.DeleteUserResponse{Success: true}, nil
}

func (s *server) ListUsers(ctx context.Context, req *pb.ListUsersRequest) (*pb.ListUsersResponse, error) {
    var users []*pb.User
    for _, user := range s.users {
        users = append(users, user)
    }
    return &pb.ListUsersResponse{Users: users}, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    
    s := grpc.NewServer()
    pb.RegisterUserServiceServer(s, NewServer())
    
    log.Printf("server listening at %v", lis.Addr())
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}', 'go', 'advanced'),

('CSS Grid Dashboard', 'Modern dashboard layout using CSS Grid', 
'.dashboard {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 1rem;
    padding: 1rem;
    min-height: 100vh;
    background: #f8fafc;
}

.sidebar {
    grid-column: 1 / 3;
    grid-row: 1 / -1;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.main-content {
    grid-column: 3 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.card {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container {
    grid-column: span 2;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-card__title {
    font-size: 0.875rem;
    color: #64748b;
}

.stat-card__value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
}

.stat-card__trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
}

.trend-up {
    color: #10b981;
}

.trend-down {
    color: #ef4444;
}

@media (max-width: 1024px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        grid-column: 1 / -1;
        grid-row: auto;
    }
    
    .main-content {
        grid-column: 1 / -1;
    }
    
    .chart-container {
        grid-column: span 1;
    }
}', 'css', 'intermediate'),

-- Continue with more snippets...', 'css', 'intermediate');', 'sql', 'advanced'),

('Python Data Pipeline', 'ETL data pipeline with error handling', 
E'from typing import Dict, List, Any
import pandas as pd
import logging
from datetime import datetime
import json
import requests
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

class DataPipeline:
    def __init__(self, config_path: str):
        self.logger = self._setup_logging()
        self.config = self._load_config(config_path)
        self.output_dir = Path(self.config["output_directory"])
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _setup_logging(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        try:
            with open(config_path, "r") as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"Failed to load config: {e}")
            raise

    def extract_data(self, source: Dict[str, Any]) -> pd.DataFrame:
        """Extract data from various sources"""
        try:
            if source["type"] == "csv":
                return pd.read_csv(source["path"])
            elif source["type"] == "api":
                response = requests.get(
                    source["url"],
                    headers=source.get("headers", {}),
                    params=source.get("params", {})
                )
                response.raise_for_status()
                return pd.DataFrame(response.json())
            else:
                raise ValueError(f"Unsupported source type: {source[\'type\']}")
        except Exception as e:
            self.logger.error(f"Extraction failed: {e}")
            raise

    def transform_data(self, df: pd.DataFrame, transformations: List[Dict[str, Any]]) -> pd.DataFrame:
        """Apply transformations to the data"""
        try:
            for transform in transformations:
                if transform["type"] == "rename":
                    df = df.rename(columns=transform["mapping"])
                elif transform["type"] == "filter":
                    df = df.query(transform["condition"])
                elif transform["type"] == "calculate":
                    df[transform["column"]] = df.eval(transform["expression"])
                elif transform["type"] == "clean":
                    for col in transform["columns"]:
                        df[col] = df[col].fillna(transform.get("fill_value", 0))
                else:
                    raise ValueError(f"Unsupported transformation: {transform[\'type\']}")
            return df
        except Exception as e:
            self.logger.error(f"Transformation failed: {e}")
            raise

    def load_data(self, df: pd.DataFrame, destination: Dict[str, Any]) -> None:
        """Load data to destination"""
        try:
            if destination["type"] == "csv":
                df.to_csv(
                    self.output_dir / f"output_{datetime.now():%Y%m%d_%H%M%S}.csv",
                    index=False
                )
            elif destination["type"] == "database":
                from sqlalchemy import create_engine
                engine = create_engine(destination["connection_string"])
                df.to_sql(
                    destination["table_name"],
                    engine,
                    if_exists="append",
                    index=False
                )
            else:
                raise ValueError(f"Unsupported destination type: {destination[\'type\']}")
        except Exception as e:
            self.logger.error(f"Load failed: {e}")
            raise

    def process_source(self, source: Dict[str, Any]) -> None:
        """Process a single data source"""
        try:
            self.logger.info(f"Processing source: {source[\'name\']}")
            df = self.extract_data(source)
            df = self.transform_data(df, source["transformations"])
            self.load_data(df, source["destination"])
            self.logger.info(f"Completed processing source: {source[\'name\']}")
        except Exception as e:
            self.logger.error(f"Failed to process source {source[\'name\']}: {e}")

    def run(self) -> None:
        """Run the complete pipeline"""
        start_time = datetime.now()
        self.logger.info("Starting pipeline")

        try:
            with ThreadPoolExecutor(max_workers=self.config.get("max_workers", 4)) as executor:
                executor.map(self.process_source, self.config["sources"])
        except Exception as e:
            self.logger.error(f"Pipeline failed: {e}")
            raise
        finally:
            duration = datetime.now() - start_time
            self.logger.info(f"Pipeline completed in {duration}")

if __name__ == "__main__":
    pipeline = DataPipeline("config.json")
    pipeline.run()', 'python', 'advanced'),

-- Continue with more snippets... 

('React Custom Form Hook', 'Type-safe form management hook', 
'import { useState, useCallback } from "react";

interface FormConfig<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: FormConfig<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false
  });

  const handleChange = useCallback((
    name: keyof T,
    value: T[keyof T]
  ) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value
      },
      touched: {
        ...prev.touched,
        [name]: true
      }
    }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true
      }
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setState(prev => ({
      ...prev,
      isSubmitting: true
    }));

    try {
      if (validate) {
        const errors = validate(state.values);
        if (Object.keys(errors).length > 0) {
          setState(prev => ({
            ...prev,
            errors,
            isSubmitting: false
          }));
          return;
        }
      }

      await onSubmit(state.values);
      
      setState(prev => ({
        ...prev,
        errors: {},
        isSubmitting: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: {
          submit: error instanceof Error ? error.message : "Submission failed"
        },
        isSubmitting: false
      }));
    }
  }, [state.values, onSubmit, validate]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  };
}

// Example usage
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginComponent() {
  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginForm, string>> = {};
      
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      // Handle login
      console.log("Submitting:", values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={form.values.email}
          onChange={e => form.handleChange("email", e.target.value)}
          onBlur={() => form.handleBlur("email")}
          className={form.errors.email && form.touched.email ? "error" : ""}
        />
        {form.errors.email && form.touched.email && (
          <p className="error">{form.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.values.password}
          onChange={e => form.handleChange("password", e.target.value)}
          onBlur={() => form.handleBlur("password")}
          className={form.errors.password && form.touched.password ? "error" : ""}
        />
        {form.errors.password && form.touched.password && (
          <p className="error">{form.errors.password}</p>
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={form.values.rememberMe}
            onChange={e => form.handleChange("rememberMe", e.target.checked)}
          />
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded"
      >
        {form.isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}', 'typescript', 'advanced'),

('Python AsyncIO Web Scraper', 'Asynchronous web scraper with rate limiting', 
'import asyncio
import aiohttp
import logging
from typing import List, Dict, Any
from datetime import datetime
from bs4 import BeautifulSoup
from dataclasses import dataclass
from aiohttp import ClientSession
from asyncio import Semaphore
import json
import re

@dataclass
class ScrapingConfig:
    urls: List[str]
    concurrency_limit: int = 5
    rate_limit: float = 1.0  # seconds between requests
    timeout: float = 30.0
    retries: int = 3
    user_agent: str = "Mozilla/5.0 (compatible; AsyncScraper/1.0)"

@dataclass
class ScrapingResult:
    url: str
    status: int
    data: Dict[str, Any]
    error: str | None = None
    duration: float = 0.0

class AsyncScraper:
    def __init__(self, config: ScrapingConfig):
        self.config = config
        self.semaphore = Semaphore(config.concurrency_limit)
        self.results: List[ScrapingResult] = []
        self.session: ClientSession | None = None
        self.logger = self._setup_logging()

    def _setup_logging(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger

    async def _fetch_with_retry(self, url: str) -> ScrapingResult:
        start_time = datetime.now()
        
        for attempt in range(self.config.retries):
            try:
                async with self.semaphore:
                    # Rate limiting
                    await asyncio.sleep(self.config.rate_limit)
                    
                    async with self.session.get(
                        url,
                        timeout=self.config.timeout,
                        headers={"User-Agent": self.config.user_agent}
                    ) as response:
                        html = await response.text()
                        
                        # Parse the HTML
                        data = await self._parse_html(html)
                        
                        duration = (datetime.now() - start_time).total_seconds()
                        return ScrapingResult(
                            url=url,
                            status=response.status,
                            data=data,
                            duration=duration
                        )

            except asyncio.TimeoutError:
                error = f"Timeout error on attempt {attempt + 1}"
                self.logger.warning(f"{url}: {error}")
                if attempt == self.config.retries - 1:
                    return self._create_error_result(url, error, start_time)

            except Exception as e:
                error = f"Error on attempt {attempt + 1}: {str(e)}"
                self.logger.error(f"{url}: {error}")
                if attempt == self.config.retries - 1:
                    return self._create_error_result(url, error, start_time)

            # Exponential backoff
            await asyncio.sleep(2 ** attempt)

    def _create_error_result(self, url: str, error: str, start_time: datetime) -> ScrapingResult:
        duration = (datetime.now() - start_time).total_seconds()
        return ScrapingResult(
            url=url,
            status=0,
            data={},
            error=error,
            duration=duration
        )

    async def _parse_html(self, html: str) -> Dict[str, Any]:
        """Override this method to implement custom parsing logic"""
        soup = BeautifulSoup(html, "html.parser")
        
        # Example parsing logic
        data = {
            "title": soup.title.string if soup.title else None,
            "meta_description": soup.find("meta", {"name": "description"})["content"]
                if soup.find("meta", {"name": "description"}) else None,
            "h1_tags": [h1.text.strip() for h1 in soup.find_all("h1")],
            "links": [
                {
                    "text": a.text.strip(),
                    "href": a.get("href"),
                    "rel": a.get("rel")
                }
                for a in soup.find_all("a", href=True)
            ]
        }
        
        return data

    async def scrape(self) -> List[ScrapingResult]:
        async with aiohttp.ClientSession() as session:
            self.session = session
            tasks = [
                self._fetch_with_retry(url)
                for url in self.config.urls
            ]
            self.results = await asyncio.gather(*tasks)
            return self.results

    def save_results(self, filename: str):
        """Save results to a JSON file"""
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(
                [
                    {
                        "url": r.url,
                        "status": r.status,
                        "data": r.data,
                        "error": r.error,
                        "duration": r.duration
                    }
                    for r in self.results
                ],
                f,
                indent=2,
                ensure_ascii=False
            )

async def main():
    # Example usage
    config = ScrapingConfig(
        urls=[
            "https://example.com",
            "https://example.org",
            "https://example.net"
        ],
        concurrency_limit=3,
        rate_limit=1.0
    )
    
    scraper = AsyncScraper(config)
    results = await scraper.scrape()
    
    # Print summary
    success_count = len([r for r in results if not r.error])
    total_time = sum(r.duration for r in results)
    
    print(f"\nScraping Summary:")
    print(f"Total URLs: {len(results)}")
    print(f"Successful: {success_count}")
    print(f"Failed: {len(results) - success_count}")
    print(f"Total time: {total_time:.2f} seconds")
    
    # Save results
    scraper.save_results("scraping_results.json")

if __name__ == "__main__":
    asyncio.run(main())', 'python', 'advanced'),

('Rust Error Handling', 'Comprehensive error handling in Rust', 
'use std::error::Error;
use std::fmt;
use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;
use std::result;

// Custom error type
#[derive(Debug)]
pub enum AppError {
    Io(io::Error),
    Parse(ParseIntError),
    Validation(String),
    NotFound(String),
    Database(String),
}

// Implement std::error::Error for AppError
impl Error for AppError {
    fn source(&self) -> Option<&(dyn Error + ''static)> {
        match self {
            AppError::Io(err) => Some(err),
            AppError::Parse(err) => Some(err),
            _ => None,
        }
    }
}

// Implement Display for AppError
impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Io(err) => write!(f, "I/O error: {}", err),
            AppError::Parse(err) => write!(f, "Parse error: {}", err),
            AppError::Validation(msg) => write!(f, "Validation error: {}", msg),
            AppError::NotFound(item) => write!(f, "Not found: {}", item),
            AppError::Database(msg) => write!(f, "Database error: {}", msg),
        }
    }
}

// Implement From for common error types
impl From<io::Error> for AppError {
    fn from(err: io::Error) -> AppError {
        AppError::Io(err)
    }
}

impl From<ParseIntError> for AppError {
    fn from(err: ParseIntError) -> AppError {
        AppError::Parse(err)
    }
}

// Type alias for Result with AppError
type Result<T> = result::Result<T, AppError>;

// Example functions using the error handling
fn read_config(path: &str) -> Result<String> {
    let mut file = File::open(path).map_err(|e| {
        AppError::Io(io::Error::new(
            e.kind(),
            format!("Failed to open config file: {}", e)
        ))
    })?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn parse_config(contents: &str) -> Result<Config> {
    let config: Config = serde_json::from_str(contents).map_err(|e| {
        AppError::Validation(format!("Invalid config format: {}", e))
    })?;

    validate_config(&config)?;
    Ok(config)
}

fn validate_config(config: &Config) -> Result<()> {
    if config.max_retries < 1 {
        return Err(AppError::Validation(
            "max_retries must be greater than 0".to_string()
        ));
    }

    if config.timeout < 1000 {
        return Err(AppError::Validation(
            "timeout must be at least 1000ms".to_string()
        ));
    }

    Ok(())
}

// Example usage with error handling
fn main() -> Result<()> {
    // Chain operations with proper error handling
    let config_path = "config.json";
    let contents = read_config(config_path)?;
    let config = parse_config(&contents)?;

    // Use the ? operator with custom error mapping
    let user = find_user(&config.user_id).map_err(|e| {
        AppError::NotFound(format!("User not found: {}", e))
    })?;

    // Handle different error cases
    match process_data(&config, &user) {
        Ok(result) => println!("Processing successful: {:?}", result),
        Err(AppError::Validation(msg)) => {
            eprintln!("Validation failed: {}", msg);
            std::process::exit(1);
        }
        Err(AppError::NotFound(item)) => {
            eprintln!("Not found: {}", item);
            std::process::exit(1);
        }
        Err(e) => {
            eprintln!("An error occurred: {}", e);
            if let Some(source) = e.source() {
                eprintln!("Caused by: {}", source);
            }
            std::process::exit(1);
        }
    }

    Ok(())
}

// Helper function to demonstrate error context
fn with_context<T, E, C>(result: Result<T, E>, context: C) -> Result<T, AppError>
where
    E: Error + Send + Sync + ''static,
    C: FnOnce() -> String,
{
    result.map_err(|e| {
        AppError::Validation(format!("{}: {}", context(), e))
    })
}

// Example of using error context
fn process_file(path: &str) -> Result<()> {
    let contents = std::fs::read_to_string(path)
        .map_err(|e| AppError::Io(io::Error::new(
            e.kind(),
            format!("Failed to read file {}: {}", path, e)
        )))?;

    process_contents(&contents).map_err(|e| {
        AppError::Validation(format!("Processing failed for {}: {}", path, e))
    })?;

    Ok(())
}', 'rust', 'advanced');

-- Continue with more snippets... 