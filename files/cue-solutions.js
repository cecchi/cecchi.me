/////////////////////////
// SOLUTION 1
/////////////////////////

var blob = "Fourscoreandsevenyearsago [...] shallnotperishfromtheearth";
var complete = false;
for(l = blob.length; !complete && l > 1; l--) {
  for(s = 0; !complete && s < (blob.length - l); s++) {
    var sub = blob.substring(s, s + l);
    if(sub == sub.split('').reverse().join('')) {
      console.log(sub);
      var complete = true;
    }
  }
}




/////////////////////////
// SOLUTION 2
// Primality functions borrowed from www.javascripter.net for efficiency
/////////////////////////

// To start I just manually found the first fibonacci number over 227,000 (28)

isPrime = function(n) {
  if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
  if (n==leastFactor(n)) return true;
  return false;
}
leastFactor = function(n){
 if (isNaN(n) || !isFinite(n)) return NaN;  
 if (n==0) return 0;  
 if (n%1 || n*n<2) return 1;
 if (n%2==0) return 2;  
 if (n%3==0) return 3;  
 if (n%5==0) return 5;  
 var m = Math.sqrt(n);
 for (var i=7;i<=m;i+=30) {
  if (n%i==0)      return i;
  if (n%(i+4)==0)  return i+4;
  if (n%(i+6)==0)  return i+6;
  if (n%(i+10)==0) return i+10;
  if (n%(i+12)==0) return i+12;
  if (n%(i+16)==0) return i+16;
  if (n%(i+22)==0) return i+22;
  if (n%(i+24)==0) return i+24;
 }
 return n;
}

var fib = (function() {
  var cache = [0,1];
  return function(n) {
    if (cache[n] === undefined) {
      cache[n] = fibClosure(n-1) + fibClosure(n-2);
    }
    return cache[n];
  };
})();

var n = 28, key;
while(!isPrime((key = fib(n)))) {
  n++;
}
console.log(key);
// At this point I just used WolframAlpha to find the prime factorization... didn't feel like I needed to do that programmatically.




/////////////////////////
// SOLUTION 3
// This solution is slow... could be optimized a LOT
/////////////////////////

var nums = [3, 4, 9, 14, 15, 19, 28, 37, 47, 50, 54, 56, 59, 61, 70, 73, 78, 81, 92, 95, 97, 99];

// Modified from http://rosettacode.org/wiki/Power_set#JavaScript
var powerset = function (ary) {
    var ps = [[]];
    for (var i=0; i < ary.length; i++) {
        for (var j = 0, len = ps.length; j < len; j++) {
            ps.push(ps[j].concat(ary[i]));
        }
    }
    return ps.filter(function(set) {
        return set.length >= 3;
    });
}

var p = powerset(nums, 3);
var save = [];
p.forEach(function(set) {
    var max = Math.max.apply(null, set);
    var sum = 0;
    for(var i in set) { sum += set[i]; }
    if(max == sum - maxm) { save.push(set); }
});
console.log(save.length);