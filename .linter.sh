#!/bin/bash
cd /home/kavia/workspace/code-generation/emotitrack-ai-59280-f2ab537e/emotitrack_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

