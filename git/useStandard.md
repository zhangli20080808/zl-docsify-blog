# Git 使用规范流程

## 状态
1. 已修改 2.已暂存 3.已提交 4.特殊 未追踪
1. git add <file>
1. git rm <file> //从 git 仓库与工作区中删除指定文件 --cached 只删除 git 仓库中文件
1. git commit
1. git log --online(单行) -2最近两条
1. git reset Head // (从暂存区中撤销一个指定文件) . 撤销所有 --hard 回退版本
1. git diff
1. git checkout -b 分支名
1. git branch -D // -D 强制删除分支 -d 如果分支状态为未合并状态，不允许删除 -r 查看远程分支 -a 查看所有分支
1. git reset —soft firstCommitHash 第一次提交前面那个 commit 很有用
1. git tag -a v.1.0.0 // 默认是当前 head 也可以指定某一次 HEAD/commitId 多次提交形成一个版本，我们想打 tag，记录特殊节点
1. git push origin --delete 分支名 删除远程分支
   [Git 使用规范流程](http://www.ruanyifeng.com/blog/2015/08/git-use-process.html)

## 分支管理
