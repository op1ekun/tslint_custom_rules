import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'direct imports forbidden, import bundles instead';

    public apply(sourceFile: ts.SourceFile): Array<Lint.RuleFailure> {
        return this.applyWithWalker(new NoDirectImportsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoDirectImportsWalker extends Lint.RuleWalker {

    public visitImportDeclaration(node: ts.ImportDeclaration) {
        const opts = this.getOptions();
        const singleImport = node.importClause.parent.getText();
        const regExp = new RegExp(`\'[./]+([./a-zA-Z]+)?((${opts.join('|')})\/?)+([a-zA-Z/.]+)?\'`);
        
        if (regExp.test(singleImport)) {
            this.addFailure(
                this.createFailure(
                    node.getStart(),
                    node.getWidth(),
                    Rule.FAILURE_STRING));
                    
            console.log('matched import', singleImport);
        }

        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
