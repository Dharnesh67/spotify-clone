#include <bits/stdc++.h>
using namespace std;
class Solution
{
    public:
    //Function to find length of shortest common supersequence of two strings.
    string dp[1001][1001];
    string f(string& s1, string& s2, int i, int j) {
        if (i >= s1.size() or j >= s2.size()) {
            return "";
        }
        if (!dp[i][j].empty())
            return dp[i][j];
        if (s1[i] == s2[j])
            return dp[i][j] = s1[i] + f(s1, s2, i + 1, j + 1);

        string left = f(s1, s2, i + 1, j);
        string right = f(s1, s2, i, j + 1);
        return dp[i][j] = (left.size() > right.size()) ? left : right;
    }
    int shortestCommonSupersequence(string str1, string str2, int m, int n)
    {
        //code here
        string lcs = f(str1, str2, 0, 0); 
        string result = "";
        int i = 0, j = 0;
        for (char& c : lcs) {
            while (str1[i] != c) result += str1[i++];
            while (str2[j] != c) result += str2[j++];
            result += c, i++, j++;
        }
        result +=str1.substr(i) + str2.substr(j);
        return result.length();
    }
};
int main()
{
    Solution s;
    cout<<s.shortestCommonSupersequence("abcd", "xycd",4,4)<<endl;
    return 0;
}