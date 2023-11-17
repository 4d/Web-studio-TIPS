This repo allows you to edit:

- The [welcome tour](https://developer.qodly.com/docs/concepts/quickstart#step-3-navigate-qodly-studio-and-begin-the-welcome-tour)
- Tips
- [Templates](https://developer.qodly.com/docs/studio/design-webforms/templates)

## Tips

You can use [this editor](https://developer.4d.com/tips-editor/) to update the tips

## Templates

In order to change the templates, you need to follow these steps:

1. [Fork this repository](https://github.com/4d/tips-editor/fork)
2. [Enable Github actions](https://docs.github.com/en/actions/using-workflows/disabling-and-enabling-a-workflow)
3. Clone forked project locally, make your changes and push them
4. Open qodly studio in your browser and change the LocalStorage key `4DWS_PREFS.studio.tipsBaseUrl` to your repo url. Example: `https://raw.githubusercontent.com/midrissi/Web-studio-TIPS/gh-build`
5. Refresh Qodly Studio

Once you're done, you can [make a PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) with your changes
