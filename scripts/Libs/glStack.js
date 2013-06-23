function GlStack()
{
    this.stack = [],
    this.matrix = Matrix.I(4),

    
    this.popMatrix = function()
    {
	this.matrix = this.stack.pop();
    },

    this.pushMatrix = function()
    {
	this.stack.push(this.matrix.dup());
    },

    this.loadIdentity = function()
    {
	for (var c in this.stack)
	{
	    delete c;
	}
	this.stack.push(Matrix.I(4));
	this.matrix = Matrix.I(4);
    },

    this.translate = function(v)
    {
	mMat = Matrix.Translate($V(v[0], v[1], v[2])).ensure4x4();
	this.matrix = this.matrix.x(mMat);
    },

    this.rotate = function(ang, v)
    {
	var arad = ang * Math.PI / 180.0;
	rMat = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
	this.matrix = this.matrix.x(rMat);
    },

    this.rotateX = function(ang)
    {
	this.rotate(ang, [1.0,0.0,0.0]);
    },

    this.rotateY = function(ang)
    {
	this.rotate(ang, [0.0,1.0,0.0]);
    },

    this.rotateZ = function(ang)
    {
	this.rotate(ang, [0.0,0.0,1.0]);
    }

};

