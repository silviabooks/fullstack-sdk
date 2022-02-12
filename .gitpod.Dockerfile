FROM gitpod/workspace-full
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
