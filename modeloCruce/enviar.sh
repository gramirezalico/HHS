rsync -av --exclude="node_modules" --exclude=".git" . root@147.182.236.197:modelo
echo "Deployed to production server."
