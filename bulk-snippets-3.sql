-- Continue bulk snippet insertion
INSERT INTO code_snippets (
    id,
    title,
    description,
    content,
    language,
    difficulty,
    created_at,
    likes,
    times_completed
) VALUES

-- HTML Semantic Structure
(
    generate_uuid(),
    'Semantic HTML5 Layout',
    'Modern semantic HTML structure with accessibility features',
    '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A modern, accessible website template">
    <title>Modern Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
            <button aria-expanded="false" aria-controls="menu-list">
                <span class="sr-only">Open menu</span>
                <span aria-hidden="true">☰</span>
            </button>
            <ul id="menu-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main role="main">
        <section aria-labelledby="hero-title">
            <h1 id="hero-title">Welcome to Our Site</h1>
            <p>Discover our amazing services and products.</p>
        </section>

        <section aria-labelledby="features-title">
            <h2 id="features-title">Our Features</h2>
            <div class="features-grid">
                <article>
                    <h3>Feature 1</h3>
                    <p>Description of feature 1</p>
                </article>
                <article>
                    <h3>Feature 2</h3>
                    <p>Description of feature 2</p>
                </article>
            </div>
        </section>

        <section aria-labelledby="contact-title">
            <h2 id="contact-title">Contact Us</h2>
            <form role="form" aria-labelledby="form-title">
                <h3 id="form-title">Send us a message</h3>
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required
                           aria-required="true">
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required
                           aria-required="true">
                </div>
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" required
                            aria-required="true"></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>

    <aside role="complementary">
        <section aria-label="Related content">
            <h2>Related Articles</h2>
            <ul>
                <li><a href="#article1">Article 1</a></li>
                <li><a href="#article2">Article 2</a></li>
            </ul>
        </section>
    </aside>

    <footer role="contentinfo">
        <div class="footer-content">
            <div class="footer-section">
                <h2>About Us</h2>
                <p>Brief description about the company.</p>
            </div>
            <div class="footer-section">
                <h2>Quick Links</h2>
                <nav aria-label="Footer navigation">
                    <ul>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
        </div>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>

    <div role="alert" aria-live="polite" class="notifications">
        <!-- Dynamic notifications will be inserted here -->
    </div>
</body>
</html>',
    'html',
    'intermediate',
    NOW(),
    0,
    0
),

-- Shell Scripting
(
    generate_uuid(),
    'Advanced Bash Script',
    'Comprehensive bash script with error handling and logging',
    '#!/bin/bash

# Set strict error handling
set -euo pipefail
IFS=$''\n\t''

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/script.log"
readonly CONFIG_FILE="${SCRIPT_DIR}/config.ini"
readonly BACKUP_DIR="${SCRIPT_DIR}/backups"

# Color definitions
readonly RED=''\\033[0;31m''
readonly GREEN=''\\033[0;32m''
readonly YELLOW=''\\033[1;33m''
readonly NC=''\\033[0m'' # No Color

# Logging functions
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo -e "${timestamp} [${level}] ${message}" >> "${LOG_FILE}"
    
    case "${level}" in
        ERROR)   echo -e "${RED}${message}${NC}" ;;
        WARNING) echo -e "${YELLOW}${message}${NC}" ;;
        INFO)    echo -e "${GREEN}${message}${NC}" ;;
        *)       echo -e "${message}" ;;
    esac
}

# Error handling
error_handler() {
    local line_num="$1"
    local error_code="$2"
    log "ERROR" "Error occurred in script $0 at line ${line_num} with exit code ${error_code}"
    cleanup
    exit "${error_code}"
}

trap ''error_handler ${LINENO} $?'' ERR

# Cleanup function
cleanup() {
    log "INFO" "Performing cleanup..."
    # Add cleanup tasks here
}

trap cleanup EXIT

# Check required commands
check_requirements() {
    local required_commands=("aws" "jq" "curl")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "${cmd}" &> /dev/null; then
            log "ERROR" "Required command ''${cmd}'' is not installed"
            exit 1
        fi
    }
}

# Load configuration
load_config() {
    if [[ ! -f "${CONFIG_FILE}" ]]; then
        log "ERROR" "Configuration file not found: ${CONFIG_FILE}"
        exit 1
    }
    
    # Source config file
    source "${CONFIG_FILE}"
    
    # Validate required variables
    local required_vars=("API_KEY" "API_ENDPOINT" "BACKUP_RETENTION_DAYS")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log "ERROR" "Required configuration variable ${var} is not set"
            exit 1
        fi
    }
}

# Create backup
create_backup() {
    local backup_file="${BACKUP_DIR}/backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    log "INFO" "Creating backup: ${backup_file}"
    
    if ! tar -czf "${backup_file}" -C "${SCRIPT_DIR}" .; then
        log "ERROR" "Failed to create backup"
        return 1
    fi
    
    log "INFO" "Backup created successfully"
    return 0
}

# Clean old backups
clean_old_backups() {
    local retention_days="${1:-7}"
    
    log "INFO" "Cleaning backups older than ${retention_days} days"
    
    find "${BACKUP_DIR}" -type f -name "backup_*.tar.gz" -mtime "+${retention_days}" -exec rm {} \;
}

# API interaction
call_api() {
    local endpoint="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    
    local response
    response=$(curl -s -X "${method}" \
        -H "Authorization: Bearer ${API_KEY}" \
        -H "Content-Type: application/json" \
        ${data:+-d "${data}"} \
        "${API_ENDPOINT}/${endpoint}")
    
    if [[ "$(echo "${response}" | jq -r ''.success'')" != "true" ]]; then
        log "ERROR" "API call failed: $(echo "${response}" | jq -r ''.message'')"
        return 1
    fi
    
    echo "${response}"
    return 0
}

# Main function
main() {
    log "INFO" "Script started"
    
    # Check requirements
    check_requirements
    
    # Load configuration
    load_config
    
    # Create backup directory if it doesn''t exist
    mkdir -p "${BACKUP_DIR}"
    
    # Create backup
    if create_backup; then
        # Clean old backups
        clean_old_backups "${BACKUP_RETENTION_DAYS}"
        
        # Call API to notify about backup
        if call_api "backup/notify" "POST" "{\"backup_time\": \"$(date -u +%FT%TZ)\"}"; then
            log "INFO" "Backup process completed successfully"
        else
            log "WARNING" "Backup created but notification failed"
        fi
    else
        log "ERROR" "Backup process failed"
        exit 1
    fi
}

# Run main function
main "$@"',
    'bash',
    'advanced',
    NOW(),
    0,
    0
),

-- Docker Configuration
(
    generate_uuid(),
    'Docker Compose Setup',
    'Multi-container Docker application setup',
    'version: "3.8"

services:
  # Frontend application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:4000
    depends_on:
      - api
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  # Backend API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=myapp
      - DB_USER=postgres
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app-network
    volumes:
      - api-logs:/var/log/api
    secrets:
      - db_password
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  # Database
  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    networks:
      - app-network
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis cache
  cache:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network
    volumes:
      - cache-data:/data
    command: redis-server --appendonly yes
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus-data:/prometheus
    networks:
      - monitoring-network
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/usr/share/prometheus/console_libraries"
      - "--web.console.templates=/usr/share/prometheus/consoles"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - monitoring-network
    depends_on:
      - prometheus

networks:
  app-network:
    driver: bridge
  monitoring-network:
    driver: bridge

volumes:
  db-data:
  cache-data:
  api-logs:
  prometheus-data:
  grafana-data:

secrets:
  db_password:
    file: ./secrets/db_password.txt',
    'yaml',
    'advanced',
    NOW(),
    0,
    0
),

-- C++ Templates
(
    generate_uuid(),
    'C++ Template Metaprogramming',
    'Advanced C++ template metaprogramming examples',
    '#include <iostream>
#include <type_traits>
#include <tuple>
#include <utility>

// Compile-time factorial
template<unsigned N>
struct Factorial {
    static constexpr unsigned value = N * Factorial<N - 1>::value;
};

template<>
struct Factorial<0> {
    static constexpr unsigned value = 1;
};

// Type list implementation
template<typename... Ts>
struct TypeList {};

// Length of type list
template<typename List>
struct Length;

template<typename... Ts>
struct Length<TypeList<Ts...>> {
    static constexpr std::size_t value = sizeof...(Ts);
};

// Concatenate type lists
template<typename List1, typename List2>
struct Concat;

template<typename... Ts1, typename... Ts2>
struct Concat<TypeList<Ts1...>, TypeList<Ts2...>> {
    using type = TypeList<Ts1..., Ts2...>;
};

// Get type at index
template<std::size_t I, typename List>
struct TypeAt;

template<std::size_t I, typename Head, typename... Tail>
struct TypeAt<I, TypeList<Head, Tail...>> {
    using type = typename TypeAt<I - 1, TypeList<Tail...>>::type;
};

template<typename Head, typename... Tail>
struct TypeAt<0, TypeList<Head, Tail...>> {
    using type = Head;
};

// SFINAE example
template<typename T>
class HasToString {
    template<typename C>
    static constexpr auto check(C*) 
        -> decltype(std::declval<C>().toString(), std::true_type{});
    
    template<typename>
    static constexpr std::false_type check(...);

public:
    static constexpr bool value = decltype(check<T>(nullptr))::value;
};

// Variadic template function
template<typename... Args>
void printAll(Args&&... args) {
    (std::cout << ... << std::forward<Args>(args)) << std::endl;
}

// Perfect forwarding
template<typename T>
T&& forward(std::remove_reference_t<T>& t) noexcept {
    return static_cast<T&&>(t);
}

template<typename T>
T&& forward(std::remove_reference_t<T>&& t) noexcept {
    static_assert(!std::is_lvalue_reference<T>::value,
                 "Can''t forward an rvalue as an lvalue.");
    return static_cast<T&&>(t);
}

// Compile-time string
template<char... Chars>
struct CompileString {
    static constexpr char value[sizeof...(Chars) + 1] = {Chars..., ''\0''};
};

// Example usage
class Test {
public:
    std::string toString() const { return "Test"; }
};

int main() {
    // Factorial
    std::cout << "Factorial of 5: " << Factorial<5>::value << std::endl;

    // Type list
    using MyList = TypeList<int, double, std::string>;
    std::cout << "Length of list: " << Length<MyList>::value << std::endl;

    // SFINAE
    std::cout << "Has toString: " << HasToString<Test>::value << std::endl;
    std::cout << "Has toString: " << HasToString<int>::value << std::endl;

    // Variadic template
    printAll(1, " + ", 2, " = ", 3);

    return 0;
}',
    'cpp',
    'advanced',
    NOW(),
    0,
    0
); 